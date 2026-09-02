import type { StitchingRequest, StitchingStatus } from "@/lib/stitching";

export interface IStitchingService {
  getAll(): Promise<StitchingRequest[]>;
  getById(id: string): Promise<StitchingRequest | undefined>;
  add(request: StitchingRequest): Promise<StitchingRequest>;
  update(id: string, updates: Partial<StitchingRequest>): Promise<void>;
  delete(id: string): Promise<void>;
}

export class LocalStitchingService implements IStitchingService {
  private readonly STITCHING_KEY = "rassa_stitching_v3";

  private getStored(): StitchingRequest[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.STITCHING_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private setStored(data: StitchingRequest[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STITCHING_KEY, JSON.stringify(data));
    }
  }

  async getAll(): Promise<StitchingRequest[]> {
    return this.getStored();
  }

  async getById(id: string): Promise<StitchingRequest | undefined> {
    return this.getStored().find(r => r.id === id);
  }

  async add(request: StitchingRequest): Promise<StitchingRequest> {
    const requests = this.getStored();
    this.setStored([request, ...requests]);
    return request;
  }

  async update(id: string, updates: Partial<StitchingRequest>): Promise<void> {
    const requests = this.getStored();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates, updatedAt: new Date().toISOString() };
      this.setStored(requests);
    }
  }

  async delete(id: string): Promise<void> {
    const requests = this.getStored();
    this.setStored(requests.filter(r => r.id !== id));
  }
}

export const stitchingService = new LocalStitchingService();
