import { useState, useEffect } from "react";
import { cartService } from "@/services/CartService";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const isClient = typeof window !== "undefined";

// Module-level singleton (SSR-safe: starts empty, populated on client)
let _cart: CartItem[] = [];
let _initialized = false;
const _listeners = new Set<() => void>();

function broadcast() {
  _listeners.forEach((fn) => fn());
}

export const cartActions = {
  getItems: (): CartItem[] => _cart,

  async add(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    const qty = item.quantity ?? 1;
    const idx = _cart.findIndex(
      (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
    );
    if (idx >= 0) {
      _cart = _cart.map((c, i) => (i === idx ? { ...c, quantity: c.quantity + qty } : c));
    } else {
      _cart = [..._cart, { ...item, quantity: qty }];
    }
    broadcast();
    await cartService.save(_cart);
  },

  async remove(productId: string, size: string, color: string) {
    _cart = _cart.filter(
      (i) => !(i.productId === productId && i.size === size && i.color === color),
    );
    broadcast();
    await cartService.save(_cart);
  },

  async setQty(productId: string, size: string, color: string, qty: number) {
    if (qty <= 0) {
      await this.remove(productId, size, color);
      return;
    }
    _cart = _cart.map((i) =>
      i.productId === productId && i.size === size && i.color === color
        ? { ...i, quantity: qty }
        : i,
    );
    broadcast();
    await cartService.save(_cart);
  },

  async clear() {
    _cart = [];
    broadcast();
    await cartService.save(_cart);
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!_initialized && isClient) {
      cartService.get().then((data) => {
        _cart = data;
        _initialized = true;
        setItems([..._cart]);
      });
    } else {
      setItems([..._cart]);
    }
    const update = () => setItems([..._cart]);
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    items,
    itemCount,
    subtotal,
    addToCart: cartActions.add.bind(cartActions),
    removeFromCart: cartActions.remove.bind(cartActions),
    setQty: cartActions.setQty.bind(cartActions),
    clearCart: cartActions.clear.bind(cartActions),
  };
}
