import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pjjiwghqfonoirxtpkgd.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInsert() {
  console.log("Testing Address Insert...");
  const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .insert({
        profile_id: null,
        type: "SHIPPING",
        full_name: "Test Name",
        address_line1: "123 Test St",
        city: "Test City",
        state: "Test State",
        postal_code: "123456",
        phone: "+919999999999",
      })
      .select("id")
      .single();

  if (addressError) {
    console.error("Address Error:", addressError);
  } else {
    console.log("Address success:", addressData.id);
  }

  console.log("Testing Order Insert...");
  const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: 'TEST-' + Date.now(),
        profile_id: null,
        guest_email: 'test@example.com',
        guest_phone: '+919999999999',
        status: 'PENDING_PAYMENT',
        subtotal: 100,
        shipping_fee: 0,
        discount_amount: 0,
        total: 100,
        shipping_address_id: addressData?.id || null,
        razorpay_order_id: undefined,
        razorpay_payment_id: undefined,
        notes: `Shipping: standard`,
      })
      .select("*")
      .single();

  if (orderError) {
    console.error("Order Error:", orderError);
  } else {
    console.log("Order success:", newOrder.id);
  }
}

testInsert();
