"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  serviceId: string;
  quantity: number;
  service: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (serviceId: string, service: CartItem["service"]) => void;
  removeItem: (serviceId: string) => void;
  clearCart: () => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (serviceId: string, service: CartItem["service"]) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.serviceId === serviceId);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.serviceId === serviceId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { serviceId, quantity: 1, service }];
    });
  };

  const removeItem = (serviceId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.serviceId !== serviceId)
    );
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.serviceId === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
