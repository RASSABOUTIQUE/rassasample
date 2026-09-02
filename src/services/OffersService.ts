import type { Offer } from "@/lib/offers";
import { DEFAULT_OFFERS } from "@/lib/offers"; // I'll export DEFAULT_OFFERS

export interface IOffersService {
  get(): Promise<Offer[]>;
  save(offers: Offer[]): Promise<void>;
}

export class LocalOffersService implements IOffersService {
  private readonly KEY = "rassa_offers_v3";

  async get(): Promise<Offer[]> {
    if (typeof window === "undefined") return DEFAULT_OFFERS;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(this.KEY, JSON.stringify(DEFAULT_OFFERS));
      return DEFAULT_OFFERS;
    } catch {
      return DEFAULT_OFFERS;
    }
  }

  async save(offers: Offer[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.KEY, JSON.stringify(offers));
  }
}

export const offersService = new LocalOffersService();
