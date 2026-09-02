export interface ITrackingService {
  getRecentlyViewed(): Promise<string[]>;
  addRecentlyViewed(id: string): Promise<void>;
}

export class LocalTrackingService implements ITrackingService {
  private readonly KEY = "rassa_recently_viewed";

  async getRecentlyViewed(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async addRecentlyViewed(id: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(this.KEY);
      let list: string[] = raw ? JSON.parse(raw) : [];
      list = list.filter((i) => i !== id);
      list.unshift(id);
      if (list.length > 10) list = list.slice(0, 10);
      localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export const trackingService = new LocalTrackingService();
