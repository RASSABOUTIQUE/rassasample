import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OfferType = "percentage" | "flat" | "free_shipping" | "bogo";

export interface Offer {
  id: string;
  name: string;
  description: string;
  type: OfferType;
  value: number;         // % or ₹
  code: string;         // UPPERCASE coupon code
  minPurchase: number;
  maxDiscount: number;   // 0 = no cap
  startDate: string;     // ISO
  endDate: string;
  active: boolean;
  usageLimit: number;    // 0 = unlimited
  usageCount: number;
  showBanner: boolean;
  bannerText: string;
  autoApply: boolean;    // auto-apply at checkout (no code needed)
  createdAt: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_OFFERS: Offer[] = [
  {
    id: "off-1",
    name: "Welcome Offer",
    description: "15% off for new customers",
    type: "percentage",
    value: 15,
    code: "WELCOME15",
    minPurchase: 500,
    maxDiscount: 500,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
    usageLimit: 0,
    usageCount: 0,
    showBanner: false,
    bannerText: "New customer? Get 15% off with WELCOME15",
    autoApply: false,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "off-2",
    name: "Rassa 10",
    description: "10% off on any order",
    type: "percentage",
    value: 10,
    code: "RASSA10",
    minPurchase: 0,
    maxDiscount: 300,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
    usageLimit: 0,
    usageCount: 0,
    showBanner: false,
    bannerText: "",
    autoApply: false,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "off-3",
    name: "Onam Special",
    description: "20% off for Onam 2026",
    type: "percentage",
    value: 20,
    code: "ONAM20",
    minPurchase: 1000,
    maxDiscount: 1000,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    active: true,
    usageLimit: 0,
    usageCount: 0,
    showBanner: true,
    bannerText: "🎉 Onam Special: 20% off with code ONAM20",
    autoApply: false,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const isClient = typeof window !== "undefined";

let _offers: Offer[] = DEFAULT_OFFERS;
let _initialized = false;
const _listeners = new Set<() => void>();

function broadcast() {
  _listeners.forEach((fn) => fn());
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const offerActions = {
  get: () => _offers,
  getActive: () => {
    const now = new Date().toISOString().slice(0, 10);
    return _offers.filter(
      (o) => o.active && o.startDate <= now && o.endDate >= now,
    );
  },

  /**
   * Validate a coupon code and return discount amount.
   * Returns { valid, discount, message }
   */
  applyCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const now = new Date().toISOString().slice(0, 10);
    const offer = _offers.find(
      (o) => o.code === code.toUpperCase() && o.active && o.startDate <= now && o.endDate >= now,
    );

    if (!offer) return { valid: false, discount: 0, message: "Coupon code not found or expired." };
    if (subtotal < offer.minPurchase)
      return {
        valid: false,
        discount: 0,
        message: `Minimum purchase of ${offer.minPurchase} required for this code.`,
      };
    if (offer.usageLimit > 0 && offer.usageCount >= offer.usageLimit)
      return { valid: false, discount: 0, message: "This coupon has reached its usage limit." };

    let discount = 0;
    if (offer.type === "percentage") {
      discount = Math.round(subtotal * (offer.value / 100));
      if (offer.maxDiscount > 0) discount = Math.min(discount, offer.maxDiscount);
    } else if (offer.type === "flat") {
      discount = Math.min(offer.value, subtotal);
    } else if (offer.type === "free_shipping") {
      discount = 0; // handled separately in checkout
    }

    return { valid: true, discount, message: `Coupon applied! You save ₹${discount}.` };
  },

  async recordUsage(id: string) {
    _offers = _offers.map((o) => (o.id === id ? { ...o, usageCount: o.usageCount + 1 } : o));
    broadcast();
    await offersService.save(_offers);
  },

  async add(offer: Omit<Offer, "id" | "usageCount" | "createdAt">) {
    const newOffer: Offer = {
      ...offer,
      id: `off-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    _offers = [newOffer, ..._offers];
    broadcast();
    await offersService.save(_offers);
    return newOffer;
  },

  async update(id: string, updates: Partial<Offer>) {
    _offers = _offers.map((o) => (o.id === id ? { ...o, ...updates } : o));
    broadcast();
    await offersService.save(_offers);
  },

  async delete(id: string) {
    _offers = _offers.filter((o) => o.id !== id);
    broadcast();
    await offersService.save(_offers);
  },

  async toggle(id: string) {
    _offers = _offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o));
    broadcast();
    await offersService.save(_offers);
  },
};

// ─── React hook ───────────────────────────────────────────────────────────────

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!_initialized && isClient) {
      offersService.get().then((data) => {
        _offers = data;
        _initialized = true;
        setOffers([..._offers]);
      });
    } else {
      setOffers([..._offers]);
    }
    const update = () => setOffers([..._offers]);
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return { offers, ...offerActions };
}
