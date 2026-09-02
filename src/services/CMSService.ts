import type { CMSData, CMSHero, CMSAnnouncement, CMSStore, CMSCategory, CMSFAQItem, CMSReview } from "@/lib/cms";
import { DEFAULT_CMS } from "@/lib/cms";
import { supabase } from "@/lib/supabase";

export interface ICMSService {
  get(): Promise<CMSData>;
  update(updates: Partial<CMSData>): Promise<void>;
  updateHero(updates: Partial<CMSHero>): Promise<void>;
  updateAnnouncement(updates: Partial<CMSAnnouncement>): Promise<void>;
  updateStore(updates: Partial<CMSStore>): Promise<void>;
  updateHomepage(updates: Partial<CMSData["homepage"]>): Promise<void>;
  updatePages(updates: Partial<CMSData["pages"]>): Promise<void>;
  addFAQ(item: Omit<CMSFAQItem, "id" | "order">): Promise<CMSFAQItem>;
  updateFAQ(id: string, updates: Partial<CMSFAQItem>): Promise<void>;
  deleteFAQ(id: string): Promise<void>;
  addReview(review: Omit<CMSReview, "id">): Promise<CMSReview>;
  updateReview(id: string, updates: Partial<CMSReview>): Promise<void>;
  deleteReview(id: string): Promise<void>;
  addCategory(cat: Omit<CMSCategory, "id" | "order">): Promise<CMSCategory>;
  updateCategory(id: string, updates: Partial<CMSCategory>): Promise<void>;
  deleteCategory(id: string): Promise<void>;
}

export class SupabaseCMSService implements ICMSService {
  
  private deepMerge(defaults: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
    const result = { ...defaults };
    for (const key of Object.keys(overrides)) {
      if (
        overrides[key] !== null &&
        typeof overrides[key] === "object" &&
        !Array.isArray(overrides[key]) &&
        typeof defaults[key] === "object" &&
        !Array.isArray(defaults[key])
      ) {
        result[key] = this.deepMerge(
          defaults[key] as Record<string, unknown>,
          overrides[key] as Record<string, unknown>,
        );
      } else {
        result[key] = overrides[key];
      }
    }
    return result;
  }

  async get(): Promise<CMSData> {
    const [settingsRes, categoriesRes] = await Promise.all([
      supabase.from("cms_settings").select("*").eq("id", 1).single(),
      supabase.from("categories").select("*").order("order_index", { ascending: true })
    ]);

    let data: Partial<CMSData> = {};

    if (settingsRes.data) {
      const s = settingsRes.data;
      data = {
        hero: s.homepage_hero || {},
        announcement: s.announcement || {},
        store: s.store || {},
        homepage: s.homepage || {},
        pages: s.pages || {},
        faq: s.faq || [],
        reviews: s.reviews || [],
      };
    }

    if (categoriesRes.data) {
      data.categories = categoriesRes.data.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description || "",
        image: c.image_url || "",
        visible: c.is_active,
        featured: c.featured || false,
        order: c.order_index || 0,
      }));
    } else {
      data.categories = [];
    }

    return this.deepMerge(DEFAULT_CMS as unknown as Record<string, unknown>, data as Record<string, unknown>) as CMSData;
  }

  async update(updates: Partial<CMSData>): Promise<void> {
    const payload: any = {};
    if (updates.hero) payload.homepage_hero = updates.hero;
    if (updates.announcement) payload.announcement = updates.announcement;
    if (updates.store) payload.store = updates.store;
    if (updates.homepage) payload.homepage = updates.homepage;
    if (updates.pages) payload.pages = updates.pages;
    if (updates.faq) payload.faq = updates.faq;
    if (updates.reviews) payload.reviews = updates.reviews;

    if (Object.keys(payload).length > 0) {
      await supabase.from("cms_settings").update(payload).eq("id", 1);
    }
  }

  async updateHero(updates: Partial<CMSHero>): Promise<void> {
    const current = await this.get();
    await this.update({ hero: { ...current.hero, ...updates } });
  }

  async updateAnnouncement(updates: Partial<CMSAnnouncement>): Promise<void> {
    const current = await this.get();
    await this.update({ announcement: { ...current.announcement, ...updates } });
  }

  async updateStore(updates: Partial<CMSStore>): Promise<void> {
    const current = await this.get();
    await this.update({ store: { ...current.store, ...updates } });
  }

  async updateHomepage(updates: Partial<CMSData["homepage"]>): Promise<void> {
    const current = await this.get();
    await this.update({ homepage: { ...current.homepage, ...updates } });
  }

  async updatePages(updates: Partial<CMSData["pages"]>): Promise<void> {
    const current = await this.get();
    await this.update({ pages: { ...current.pages, ...updates } });
  }

  async addFAQ(item: Omit<CMSFAQItem, "id" | "order">): Promise<CMSFAQItem> {
    const current = await this.get();
    const newItem: CMSFAQItem = {
      ...item,
      id: `f${Date.now()}`,
      order: current.faq.length + 1,
    };
    await this.update({ faq: [...current.faq, newItem] });
    return newItem;
  }

  async updateFAQ(id: string, updates: Partial<CMSFAQItem>): Promise<void> {
    const current = await this.get();
    await this.update({ faq: current.faq.map(f => f.id === id ? { ...f, ...updates } : f) });
  }

  async deleteFAQ(id: string): Promise<void> {
    const current = await this.get();
    await this.update({ faq: current.faq.filter(f => f.id !== id) });
  }

  async addReview(review: Omit<CMSReview, "id">): Promise<CMSReview> {
    const current = await this.get();
    const newReview: CMSReview = { ...review, id: `r${Date.now()}` };
    await this.update({ reviews: [newReview, ...current.reviews] });
    return newReview;
  }

  async updateReview(id: string, updates: Partial<CMSReview>): Promise<void> {
    const current = await this.get();
    await this.update({ reviews: current.reviews.map(r => r.id === id ? { ...r, ...updates } : r) });
  }

  async deleteReview(id: string): Promise<void> {
    const current = await this.get();
    await this.update({ reviews: current.reviews.filter(r => r.id !== id) });
  }

  // --- Category Management (Now backed by the `categories` table) ---

  async addCategory(cat: Omit<CMSCategory, "id" | "order">): Promise<CMSCategory> {
    const current = await this.get();
    const newOrder = current.categories.length + 1;

    const payload = {
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      image_url: cat.image,
      is_active: cat.visible,
      featured: cat.featured,
      order_index: newOrder
    };

    const { data, error } = await supabase.from("categories").insert(payload).select().single();
    if (error || !data) throw new Error(error?.message || "Failed to add category");

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || "",
      image: data.image_url || "",
      visible: data.is_active,
      featured: data.featured || false,
      order: data.order_index,
    };
  }

  async updateCategory(id: string, updates: Partial<CMSCategory>): Promise<void> {
    const payload: any = {};
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.visible !== undefined) payload.is_active = updates.visible;
    if (updates.featured !== undefined) payload.featured = updates.featured;
    if (updates.order !== undefined) payload.order_index = updates.order;

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase.from("categories").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export const cmsService = new SupabaseCMSService();
