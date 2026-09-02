import { useState, useEffect } from "react";
import { stitchingService } from "@/services/StitchingService";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StitchingStatus =
  | "received"
  | "reviewing"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";

export interface StitchingRequest {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  garmentType: string;
  fabric?: string;
  referenceImageUrl?: string;
  notes: string;
  measurements: Record<string, string>;
  status: StitchingStatus;
  designerNotes: string;
  tailorName: string;
  deliveryDate: string;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export const STITCHING_STATUS_LABELS: Record<StitchingStatus, string> = {
  received: "Request Received",
  reviewing: "Under Review",
  in_progress: "In Progress",
  ready: "Ready for Pickup / Dispatch",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STITCHING_STATUS_COLORS: Record<StitchingStatus, string> = {
  received: "text-blue-400",
  reviewing: "text-yellow-400",
  in_progress: "text-purple-400",
  ready: "text-orange-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

// ─── Store ────────────────────────────────────────────────────────────────────
const isClient = typeof window !== "undefined";

let _requests: StitchingRequest[] = [];
const _listeners = new Set<() => void>();
let _initialized = false;

function broadcast() {
  _listeners.forEach((fn) => fn());
}

async function initializeStitching() {
  if (!isClient) return;
  _requests = await stitchingService.getAll();
  _initialized = true;
  broadcast();
}

if (isClient) {
  initializeStitching();
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const stitchingActions = {
  getAll: () => _requests,
  getById: (id: string) => _requests.find((r) => r.id === id),
  getPending: () => _requests.filter((r) => r.status !== "delivered" && r.status !== "cancelled"),

  async add(data: Omit<StitchingRequest, "id" | "orderNo" | "status" | "designerNotes" | "tailorName" | "deliveryDate" | "estimatedPrice" | "createdAt" | "updatedAt">) {
    const req: StitchingRequest = {
      ...data,
      id: `stitch-${Date.now()}`,
      orderNo: `RS${Date.now().toString().slice(-6)}`,
      status: "received",
      designerNotes: "",
      tailorName: "",
      deliveryDate: "",
      estimatedPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const addedReq = await stitchingService.add(req);
    _requests = [addedReq, ..._requests];
    broadcast();
    return addedReq;
  },

  async update(id: string, updates: Partial<StitchingRequest>) {
    await stitchingService.update(id, updates);
    _requests = _requests.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
    );
    broadcast();
  },

  async updateStatus(id: string, status: StitchingStatus) {
    await this.update(id, { status });
  },

  async delete(id: string) {
    await stitchingService.delete(id);
    _requests = _requests.filter((r) => r.id !== id);
    broadcast();
  },

  getStats() {
    return {
      total: _requests.length,
      pending: _requests.filter((r) => r.status !== "delivered" && r.status !== "cancelled").length,
      inProgress: _requests.filter((r) => r.status === "in_progress").length,
      ready: _requests.filter((r) => r.status === "ready").length,
    };
  },
};

// ─── React hook ───────────────────────────────────────────────────────────────

export function useStitching() {
  const [requests, setRequests] = useState<StitchingRequest[]>(_requests);
  const [loading, setLoading] = useState(!_initialized);

  useEffect(() => {
    setRequests([..._requests]);
    setLoading(!_initialized);
    const update = () => {
      setRequests([..._requests]);
      setLoading(false);
    };
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return { requests, loading, ...stitchingActions };
}

