export interface MediaAsset {
  id: string;
  url: string;
  title: string;
  folder: string;
  size?: string;
  createdAt: string;
}

export interface IMediaService {
  getAll(): Promise<MediaAsset[]>;
  add(url: string, title: string, folder: string): Promise<MediaAsset>;
  delete(id: string): Promise<void>;
  getFolders(): Promise<string[]>;
}

export class LocalMediaService implements IMediaService {
  private readonly MEDIA_KEY = "rassa_media_v1";

  private getStored(): MediaAsset[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.MEDIA_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private setStored(data: MediaAsset[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.MEDIA_KEY, JSON.stringify(data));
    }
  }

  async getAll(): Promise<MediaAsset[]> {
    return this.getStored();
  }

  async add(url: string, title: string, folder: string): Promise<MediaAsset> {
    const assets = this.getStored();
    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      url,
      title: title || url.split("/").pop() || "Image",
      folder: folder || "uncategorized",
      createdAt: new Date().toISOString(),
    };
    this.setStored([newAsset, ...assets]);
    return newAsset;
  }

  async delete(id: string): Promise<void> {
    const assets = this.getStored();
    this.setStored(assets.filter(a => a.id !== id));
  }

  async getFolders(): Promise<string[]> {
    const assets = this.getStored();
    const folders = new Set(assets.map(a => a.folder));
    return Array.from(folders);
  }
}

export const mediaService = new LocalMediaService();
