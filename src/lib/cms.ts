import { useState, useEffect } from "react";
import { cmsService } from "@/services/CMSService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CMSHero {
  badge: string;
  line1: string;
  line2: string;
  subtitle: string;
  cta1Label: string;
  cta1Link: string;
  cta2Label: string;
  cta2Link: string;
}

export interface CMSAnnouncement {
  enabled: boolean;
  text: string;
  link: string;
  color: "gold" | "red" | "green" | "blue";
}

export interface CMSCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  visible: boolean;
  featured: boolean;
  order: number;
  seasonal?: string;
}

export interface CMSFAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  visible: boolean;
}

export interface CMSReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  product?: string;
  verified: boolean;
  visible: boolean;
  pinned: boolean;
  date: string;
  reply?: string;
}

export interface CMSStore {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst: string;
  hours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  googleMapsLink: string;
  logoUrl: string;
  freeShippingThreshold: number;
  standardShipping: number;
  expressShipping: number;
  codEnabled: boolean;
  whatsappPayEnabled: boolean;
  razorpayEnabled: boolean;
  storeClosed: boolean;
  storeClosedMessage: string;
}

export interface CMSData {
  announcement: CMSAnnouncement;
  hero: CMSHero;
  homepage: {
    showNewArrivals: boolean;
    newArrivalTitle: string;
    newArrivalSubtitle: string;
    newArrivalProductIds: string[];
    showFeatured: boolean;
    featuredTitle: string;
    featuredProductIds: string[];
    showCategories: boolean;
    categoryTitle: string;
    showCustomStitching: boolean;
    showReviews: boolean;
    showTrustStrip: boolean;
    trustItems: { icon: string; text: string }[];
    occasionHighlights: string[];
    seasonalCampaign?: {
      enabled: boolean;
      name: string;
      bannerText: string;
      link: string;
    };
  };
  categories: CMSCategory[];
  store: CMSStore;
  pages: {
    about: string;
    returnPolicy: string;
    privacyPolicy: string;
    shippingPolicy: string;
    footerTagline: string;
  };
  faq: CMSFAQItem[];
  reviews: CMSReview[];
}

// ─── Default values ────────────────────────────────────────────────────────────

export const DEFAULT_CMS: CMSData = {
  announcement: {
    enabled: false,
    text: "🎉 Free shipping on orders above ₹2,000 | New Onam Collection now available",
    link: "/shop",
    color: "gold",
  },
  hero: {
    badge: "Kerala's Premier Boutique",
    line1: "Dressed in",
    line2: "Kerala's Finest",
    subtitle:
      "Silk sarees, kasavu wear, churidars and custom stitching — every piece crafted for the modern Kerala woman.",
    cta1Label: "Shop Now",
    cta1Link: "/shop",
    cta2Label: "Custom Stitching",
    cta2Link: "/custom-stitching",
  },
  homepage: {
    showNewArrivals: true,
    newArrivalTitle: "New Arrivals",
    newArrivalSubtitle: "Fresh additions to our collection — sarees, churidars, and bridal sets.",
    newArrivalProductIds: [],
    showFeatured: true,
    featuredTitle: "Featured Pieces",
    featuredProductIds: [],
    showCategories: true,
    categoryTitle: "Shop by Category",
    showCustomStitching: true,
    showReviews: true,
    showTrustStrip: true,
    trustItems: [
      { icon: "✨", text: "Kerala Handloom Certified" },
      { icon: "🚚", text: "Free Shipping ₹2000+" },
      { icon: "↩️", text: "7-Day Easy Returns" },
      { icon: "💬", text: "WhatsApp Support" },
      { icon: "🔒", text: "Secure Checkout" },
    ],
    occasionHighlights: ["Wedding", "Festival", "Casual", "Office Wear", "Party Wear"],
  },
  categories: [
    { id: "cat-sarees", name: "Sarees", description: "Silk, cotton and kasavu sarees", image: "", slug: "sarees", visible: true, featured: true, order: 1 },
    { id: "cat-bridal", name: "Bridal", description: "Kerala bridal sets and lehengas", image: "", slug: "bridal", visible: true, featured: true, order: 2 },
    { id: "cat-churidar", name: "Churidars & Salwar", description: "Anarkalis, palazzo and churidar sets", image: "", slug: "churidars", visible: true, featured: true, order: 3 },
    { id: "cat-kurtis", name: "Kurtis & Tops", description: "Casual and office kurtis", image: "", slug: "kurtis", visible: true, featured: false, order: 4 },
    { id: "cat-kasavu", name: "Kasavu Sarees", description: "Traditional Kerala kasavu", image: "", slug: "kasavu", visible: true, featured: true, order: 5 },
    { id: "cat-kids", name: "Kids Ethnic", description: "Ethnic wear for children", image: "", slug: "kids", visible: true, featured: false, order: 6 },
  ],
  store: {
    name: import.meta.env.VITE_APP_NAME || "Rassa Boutique",
    tagline: "Kerala's Premier Women's Boutique",
    phone: import.meta.env.VITE_STORE_PHONE || "+91 96334 19902",
    whatsapp: import.meta.env.VITE_STORE_WHATSAPP || "919633419902",
    email: import.meta.env.VITE_STORE_CONTACT_EMAIL || "hello@rassaboutique.in",
    address: import.meta.env.VITE_STORE_ADDRESS || "Chathamangalam, Kozhikode, Kerala 673601",
    city: "Kozhikode",
    state: "Kerala",
    pincode: "673601",
    gst: "",
    hours: "Mon–Sat: 10am–9pm | Sun: 11am–8pm",
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com/rassa_boutique",
    facebook: "",
    youtube: "",
    googleMapsLink: "",
    logoUrl: "",
    freeShippingThreshold: 2000,
    standardShipping: 80,
    expressShipping: 150,
    codEnabled: true,
    whatsappPayEnabled: true,
    razorpayEnabled: false,
    storeClosed: false,
    storeClosedMessage: "We are temporarily closed. Please check back soon.",
  },
  pages: {
    about:
      "Rassa Boutique is Kerala's premier women's fashion destination, located in the heart of Kozhikode. We bring together the finest silk sarees, kasavu wear, bridal collections, churidars and custom stitching — all curated for the modern Kerala woman who values both tradition and elegance.",
    returnPolicy:
      "We accept returns within 7 days of delivery for unused, unwashed items in original condition. Custom stitched items are non-refundable. Contact us on WhatsApp to initiate a return.",
    privacyPolicy:
      "We collect only the information necessary to process your orders (name, address, phone). We do not share your information with third parties. Your payment details are processed securely and never stored on our servers.",
    shippingPolicy:
      "Standard delivery: 3–7 working days (₹80, free above ₹2,000). Express delivery: 1–3 working days (₹150). Store pickup: Free, ready within 1 day. We ship across India.",
    footerTagline: "Crafted with love in Kozhikode, Kerala.",
  },
  faq: [
    { id: "f1", question: "How long does delivery take?", answer: "Standard delivery takes 3–7 working days. Express delivery is available for 1–3 days. You can also pick up from our store in Kozhikode.", category: "Shipping", order: 1, visible: true },
    { id: "f2", question: "Can I return or exchange my order?", answer: "Yes, we accept returns within 7 days of delivery for unused items in original condition. Custom stitched items are non-returnable. Contact us on WhatsApp.", category: "Returns", order: 2, visible: true },
    { id: "f3", question: "How do I place a custom stitching order?", answer: "Visit our Custom Stitching page to share your measurements, fabric choice and reference image. Our team will contact you within 24 hours.", category: "Stitching", order: 3, visible: true },
    { id: "f4", question: "What payment methods do you accept?", answer: "We accept Cash on Delivery (COD), WhatsApp payment (UPI/bank transfer), and online payments via Razorpay (cards, UPI, net banking).", category: "Payment", order: 4, visible: true },
    { id: "f5", question: "How can I track my order?", answer: "After placing your order, visit our Track Order page and enter your order number. You can also contact us on WhatsApp for real-time updates.", category: "Orders", order: 5, visible: true },
  ],
  reviews: [
    { id: "r1", name: "Priya Menon", rating: 5, text: "The silk saree I ordered was absolutely stunning. Perfect quality and fast delivery. Will definitely order again!", verified: true, visible: true, pinned: true, date: "2026-05-15" },
    { id: "r2", name: "Lakshmi Nair", rating: 5, text: "Beautiful bridal set, exactly as shown. The stitching was perfect for my daughter's wedding.", verified: true, visible: true, pinned: false, date: "2026-05-28" },
    { id: "r3", name: "Divya Krishnan", rating: 4, text: "Good quality churidar. Delivery was slightly delayed but the customer service was excellent.", verified: true, visible: true, pinned: false, date: "2026-06-03" },
  ],
};

// ─── Utility ───────────────────────────────────────────────────────────────────

function deepMerge(defaults: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    if (
      overrides[key] !== null &&
      typeof overrides[key] === "object" &&
      !Array.isArray(overrides[key]) &&
      typeof defaults[key] === "object" &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = deepMerge(
        defaults[key] as Record<string, unknown>,
        overrides[key] as Record<string, unknown>,
      );
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

// ─── Singleton store ───────────────────────────────────────────────────────────
const isClient = typeof window !== "undefined";

let _cms: CMSData = DEFAULT_CMS;
const _listeners = new Set<() => void>();
let _initialized = false;
let _fetching = false;

function broadcast() {
  _listeners.forEach((fn) => fn());
}

async function initializeCMS() {
  if (!isClient) return;
  if (_initialized || _fetching) return;
  _fetching = true;
  _cms = await cmsService.get();
  _initialized = true;
  broadcast();
}

if (isClient) {
  initializeCMS();
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const cmsActions = {
  get: () => _cms,

  async update(updates: Partial<CMSData>) {
    await cmsService.update(updates);
    _cms = deepMerge(_cms as unknown as Record<string, unknown>, updates as Record<string, unknown>) as CMSData;
    broadcast();
  },

  async updateHero(updates: Partial<CMSHero>) {
    await cmsService.updateHero(updates);
    _cms = { ..._cms, hero: { ..._cms.hero, ...updates } };
    broadcast();
  },

  async updateAnnouncement(updates: Partial<CMSAnnouncement>) {
    await cmsService.updateAnnouncement(updates);
    _cms = { ..._cms, announcement: { ..._cms.announcement, ...updates } };
    broadcast();
  },

  async updateStore(updates: Partial<CMSStore>) {
    await cmsService.updateStore(updates);
    _cms = { ..._cms, store: { ..._cms.store, ...updates } };
    broadcast();
  },

  async updateHomepage(updates: Partial<CMSData["homepage"]>) {
    await cmsService.updateHomepage(updates);
    _cms = { ..._cms, homepage: { ..._cms.homepage, ...updates } };
    broadcast();
  },

  async updatePages(updates: Partial<CMSData["pages"]>) {
    await cmsService.updatePages(updates);
    _cms = { ..._cms, pages: { ..._cms.pages, ...updates } };
    broadcast();
  },

  // FAQ CRUD
  async addFAQ(item: Omit<CMSFAQItem, "id" | "order">) {
    const newItem = await cmsService.addFAQ(item);
    _cms = { ..._cms, faq: [..._cms.faq, newItem] };
    broadcast();
  },

  async updateFAQ(id: string, updates: Partial<CMSFAQItem>) {
    await cmsService.updateFAQ(id, updates);
    _cms = { ..._cms, faq: _cms.faq.map((f) => (f.id === id ? { ...f, ...updates } : f)) };
    broadcast();
  },

  async deleteFAQ(id: string) {
    await cmsService.deleteFAQ(id);
    _cms = { ..._cms, faq: _cms.faq.filter((f) => f.id !== id) };
    broadcast();
  },

  // Review CRUD
  async updateReview(id: string, updates: Partial<CMSReview>) {
    await cmsService.updateReview(id, updates);
    _cms = { ..._cms, reviews: _cms.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)) };
    broadcast();
  },

  async addReview(review: Omit<CMSReview, "id">) {
    const newReview = await cmsService.addReview(review);
    _cms = { ..._cms, reviews: [newReview, ..._cms.reviews] };
    broadcast();
  },

  async deleteReview(id: string) {
    await cmsService.deleteReview(id);
    _cms = { ..._cms, reviews: _cms.reviews.filter((r) => r.id !== id) };
    broadcast();
  },

  // Category CRUD
  async addCategory(cat: Omit<CMSCategory, "id" | "order">) {
    const newCat = await cmsService.addCategory(cat);
    _cms = { ..._cms, categories: [..._cms.categories, newCat] };
    broadcast();
  },

  async updateCategory(id: string, updates: Partial<CMSCategory>) {
    await cmsService.updateCategory(id, updates);
    _cms = { ..._cms, categories: _cms.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) };
    broadcast();
  },

  async deleteCategory(id: string) {
    await cmsService.deleteCategory(id);
    _cms = { ..._cms, categories: _cms.categories.filter((c) => c.id !== id) };
    broadcast();
  },

  async reset() {
    // Reset back to defaults (local logic)
    await cmsService.update(DEFAULT_CMS);
    _cms = DEFAULT_CMS;
    broadcast();
  },
};

// ─── React hook ───────────────────────────────────────────────────────────────

export function useCMS() {
  const [cms, setCMS] = useState<CMSData>(_cms);
  const [loading, setLoading] = useState(!_initialized);

  useEffect(() => {
    setCMS({ ..._cms });
    setLoading(!_initialized);
    const update = () => {
      setCMS({ ..._cms });
      setLoading(false);
    };
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return { cms, loading, ...cmsActions };
}
