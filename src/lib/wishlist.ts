import { useState, useEffect } from "react";
import { wishlistService } from "@/services/WishlistService";

const isClient = typeof window !== "undefined";

let _wishlist: string[] = [];
let _initialized = false;
const _listeners = new Set<() => void>();

function broadcast() {
  _listeners.forEach((fn) => fn());
}

export const wishlistActions = {
  getIds: (): string[] => _wishlist,

  async toggle(id: string) {
    if (_wishlist.includes(id)) {
      _wishlist = _wishlist.filter((i) => i !== id);
    } else {
      _wishlist = [..._wishlist, id];
    }
    broadcast(); // optimistic update
    await wishlistService.save(_wishlist);
  },

  has(id: string): boolean {
    return _wishlist.includes(id);
  },
};

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!_initialized && isClient) {
      wishlistService.get().then((data) => {
        _wishlist = data;
        _initialized = true;
        setIds([..._wishlist]);
      });
    } else {
      setIds([..._wishlist]);
    }

    const update = () => setIds([..._wishlist]);
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return {
    ids,
    wishlistedIds: ids, // alias used by account.tsx and wishlist.tsx
    isWishlisted: (id: string) => ids.includes(id),
    toggleWishlist: (id: string) => {
      wishlistActions.toggle(id);
    },
    count: ids.length,
  };
}
