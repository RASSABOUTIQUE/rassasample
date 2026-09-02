export interface IWishlistService {
  get(): Promise<string[]>;
  save(ids: string[]): Promise<void>;
}

export class LocalWishlistService implements IWishlistService {
  private readonly KEY = "rassa_wishlist_v2";

  async get(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async save(ids: string[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.KEY, JSON.stringify(ids));
  }
}

export const wishlistService = new LocalWishlistService();
