import type { Order, OrderStatus, PaymentStatus } from "@/lib/orders";
import { supabase } from "@/lib/supabase";

export interface IOrderService {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  getByOrderNo(orderNo: string): Promise<Order | undefined>;
  add(order: Order): Promise<Order>;
  update(orderNo: string, updates: Partial<Order>): Promise<void>;
}

export class SupabaseOrderService implements IOrderService {
  
  async getAll(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*), shipping_address_id(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (orders || []).map((o) => this.mapToLocalOrder(o));
  }

  async getById(id: string): Promise<Order | undefined> {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), shipping_address_id(*)")
      .eq("id", id)
      .single();

    if (error || !order) return undefined;
    return this.mapToLocalOrder(order);
  }

  async getByOrderNo(orderNo: string): Promise<Order | undefined> {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), shipping_address_id(*)")
      .eq("order_number", orderNo)
      .single();

    if (error || !order) return undefined;
    return this.mapToLocalOrder(order);
  }

  async add(order: Order): Promise<Order> {
    // 1. Insert shipping address
    const addressId = crypto.randomUUID();
    const { error: addressError } = await supabase
      .from("addresses")
      .insert({
        id: addressId,
        profile_id: order.userId || null,
        type: "SHIPPING",
        full_name: order.customerName,
        address_line1: order.address,
        city: order.city,
        state: order.state,
        postal_code: order.pincode,
        phone: order.customerPhone,
      });

    if (addressError) {
      console.error("Error creating address:", addressError);
    }

    // 2. Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: order.orderNo,
        profile_id: order.userId || null,
        guest_email: order.customerEmail,
        guest_phone: order.customerPhone,
        status: order.paymentMethod === "razorpay" && order.paymentStatus !== "paid" ? "PENDING_PAYMENT" : (order.paymentStatus === "paid" ? "PAID" : "PENDING_PAYMENT"),
        subtotal: order.subtotal,
        shipping_fee: order.shippingCost,
        discount_amount: order.discount,
        total: order.total,
        shipping_address_id: addressId,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: order.razorpayPaymentId,
        notes: `Shipping: ${order.shippingMethod}`,
      })
      .select("*")
      .single();

    if (orderError || !newOrder) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order");
    }

    // 3. Insert items
    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((item) => ({
        order_id: newOrder.id,
        variant_id: null, // Frontend uses string IDs ("kb-001") which break the UUID foreign key. Storing in SKU instead.
        product_name: item.name,
        sku: item.productId, 
        size: item.size,
        color: item.color,
        price_at_purchase: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
      if (itemsError) console.error("Error creating order items:", itemsError);
    }

    // 4. Reduce stock via RPC
    const inventoryPayload = order.items.map(item => ({
       variant_id: item.productId,
       quantity: item.quantity
    }));
    
    const { error: rpcError } = await supabase.rpc('process_order_inventory', { items: inventoryPayload });
    if (rpcError) {
      console.error("Error decrementing stock:", rpcError);
      // Not throwing error to prevent order failure just because stock is off, 
      // but in strict production we might rollback order creation here.
    }

    return order;
  }

  async update(orderNo: string, updates: Partial<Order>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = this.mapStatusToDb(updates.status);
    if (updates.paymentStatus) {
       if (updates.paymentStatus === 'paid') dbUpdates.status = 'PAID';
    }
    if (updates.razorpayPaymentId) dbUpdates.razorpay_payment_id = updates.razorpayPaymentId;

    const { error } = await supabase
      .from("orders")
      .update(dbUpdates)
      .eq("order_number", orderNo);

    if (error) console.error("Error updating order:", error);
  }

  private mapStatusToDb(status: OrderStatus): string {
     const mapping: Record<string, string> = {
        placed: "PENDING_PAYMENT",
        confirmed: "PAID",
        processing: "PROCESSING",
        shipped: "SHIPPED",
        out_for_delivery: "SHIPPED",
        delivered: "DELIVERED",
        cancelled: "CANCELLED",
        returned: "RETURN_REQUESTED"
     };
     return mapping[status] || "PENDING_PAYMENT";
  }

  private mapDbToStatus(status: string): OrderStatus {
     const mapping: Record<string, OrderStatus> = {
        PENDING_PAYMENT: "placed",
        PAID: "confirmed",
        PROCESSING: "processing",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
        RETURN_REQUESTED: "returned",
        REFUNDED: "returned"
     };
     return mapping[status] || "placed";
  }

  private mapToLocalOrder(dbOrder: any): Order {
    const address = dbOrder.shipping_address_id;
    
    return {
      id: dbOrder.id,
      orderNo: dbOrder.order_number,
      userId: dbOrder.profile_id,
      customerName: address?.full_name || dbOrder.guest_email || "Customer",
      customerPhone: address?.phone || dbOrder.guest_phone || "",
      customerEmail: dbOrder.guest_email || "",
      items: (dbOrder.order_items || []).map((item: any) => ({
        productId: item.sku,
        name: item.product_name,
        price: Number(item.price_at_purchase),
        image: item.image_url || "",
        size: item.size || "",
        color: item.color || "",
        quantity: item.quantity
      })),
      subtotal: Number(dbOrder.subtotal),
      shippingCost: Number(dbOrder.shipping_fee),
      discount: Number(dbOrder.discount_amount),
      total: Number(dbOrder.total),
      status: this.mapDbToStatus(dbOrder.status),
      paymentMethod: dbOrder.razorpay_order_id ? "razorpay" : "cod",
      paymentStatus: dbOrder.status === 'PAID' || dbOrder.status === 'PROCESSING' || dbOrder.status === 'SHIPPED' || dbOrder.status === 'DELIVERED' ? "paid" : "pending",
      razorpayOrderId: dbOrder.razorpay_order_id,
      razorpayPaymentId: dbOrder.razorpay_payment_id,
      address: address?.address_line1 || "",
      city: address?.city || "",
      state: address?.state || "",
      pincode: address?.postal_code || "",
      shippingMethod: "standard", 
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      estimatedDelivery: "", 
      notes: dbOrder.notes
    };
  }
}

import { isSupabaseConfigured } from "@/lib/supabase";

export class LocalOrderService implements IOrderService {
  async getAll(): Promise<Order[]> { return []; }
  async getById(id: string): Promise<Order | undefined> { return undefined; }
  async add(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    return { ...order, id: `o_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }
  async update(orderNo: string, updates: Partial<Order>): Promise<void> {}
}

export const orderService = isSupabaseConfigured ? new SupabaseOrderService() : new LocalOrderService();
