import { useState, useEffect } from "react";
import { orderService } from "@/services/OrderService";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  orderNo: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  couponCode?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  shippingMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
}

const isClient = typeof window !== "undefined";

let _orders: Order[] = [];
const _listeners = new Set<() => void>();
let _initialized = false;

function broadcast() {
  _listeners.forEach((fn) => fn());
}

async function initializeOrders() {
  if (!isClient) return;
  _orders = await orderService.getAll();
  _initialized = true;
  broadcast();
}

if (isClient) {
  initializeOrders();
}

export const orderActions = {
  getAll: () => _orders,
  getByUser: (userId: string) => _orders.filter((o) => o.userId === userId),
  getByOrderNo: (no: string) => _orders.find((o) => o.orderNo === no),

  async addOrder(order: Order) {
    const newOrder = await orderService.add(order);
    _orders = [newOrder, ..._orders];
    broadcast();
    return newOrder;
  },

  async updateStatus(orderNo: string, status: OrderStatus) {
    await orderService.update(orderNo, { status });
    _orders = _orders.map((o) =>
      o.orderNo === orderNo
        ? { ...o, status, updatedAt: new Date().toISOString() }
        : o,
    );
    broadcast();
  },

  async updatePaymentStatus(orderNo: string, paymentStatus: PaymentStatus, razorpayPaymentId?: string) {
    const updates: Partial<Order> = { paymentStatus };
    if (razorpayPaymentId) updates.razorpayPaymentId = razorpayPaymentId;
    await orderService.update(orderNo, updates);

    _orders = _orders.map((o) =>
      o.orderNo === orderNo
        ? {
            ...o,
            paymentStatus,
            razorpayPaymentId: razorpayPaymentId ?? o.razorpayPaymentId,
            updatedAt: new Date().toISOString(),
          }
        : o,
    );
    broadcast();
  },

  async cancelOrder(orderNo: string) {
    await this.updateStatus(orderNo, "cancelled");
  },

  /** Stats for admin dashboard */
  getStats() {
    const today = new Date().toDateString();
    const thisMonth = new Date().toISOString().slice(0, 7);
    const todayOrders = _orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today,
    );
    const monthOrders = _orders.filter((o) => o.createdAt.startsWith(thisMonth));
    const revenue = _orders
      .filter((o) => o.status !== "cancelled" && o.status !== "returned")
      .reduce((s, o) => s + o.total, 0);
    const pendingOrders = _orders.filter(
      (o) => o.status === "placed" || o.status === "confirmed" || o.status === "processing",
    ).length;

    return {
      total: _orders.length,
      todayCount: todayOrders.length,
      monthCount: monthOrders.length,
      revenue,
      pending: pendingOrders,
      delivered: _orders.filter((o) => o.status === "delivered").length,
      cancelled: _orders.filter((o) => o.status === "cancelled").length,
    };
  },
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(_orders);
  const [loading, setLoading] = useState(!_initialized);

  useEffect(() => {
    setOrders([..._orders]);
    setLoading(!_initialized);
    const update = () => {
      setOrders([..._orders]);
      setLoading(false);
    };
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return {
    orders,
    loading,
    stats: orderActions.getStats(),
    addOrder: orderActions.addOrder.bind(orderActions),
    updateStatus: orderActions.updateStatus.bind(orderActions),
    updatePaymentStatus: orderActions.updatePaymentStatus.bind(orderActions),
    cancelOrder: orderActions.cancelOrder.bind(orderActions),
    getUserOrders: (userId: string) => orders.filter((o) => o.userId === userId),
  };
}

/** Generate a unique order number */
export function generateOrderNo(): string {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `RB${ts}${rand}`;
}

/** Estimate delivery date string */
export function estimateDelivery(shippingMethod: string): string {
  const days = shippingMethod === "express" ? 2 : shippingMethod === "store-pickup" ? 1 : 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  confirmed: "Confirmed",
  processing: "Being Prepared",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  placed: "text-blue-400",
  confirmed: "text-blue-400",
  processing: "text-yellow-400",
  shipped: "text-purple-400",
  out_for_delivery: "text-orange-400",
  delivered: "text-green-500",
  cancelled: "text-red-400",
  returned: "text-red-400",
};
