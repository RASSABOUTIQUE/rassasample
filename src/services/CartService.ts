import type { CartItem } from "@/lib/cart";

export interface ICartService {
  get(): Promise<CartItem[]>;
  save(items: CartItem[]): Promise<void>;
}

export class LocalCartService implements ICartService {
  private readonly KEY = "rassa_cart_v2";

  async get(): Promise<CartItem[]> {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async save(items: CartItem[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.KEY, JSON.stringify(items));
  }
}

export const cartService = new LocalCartService();
