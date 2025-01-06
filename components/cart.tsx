"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Here you can add your checkout logic
      // For example, redirect to a payment page or show a payment modal
      toast({
        title: "Checkout successful!",
        description: "Thank you for your purchase.",
      });
      clearCart();
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some services to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.serviceId}
          className="flex items-center gap-4 p-4 border rounded-lg"
        >
          <div className="relative w-20 h-20">
            <Image
              src={item.service.imageUrl}
              alt={item.service.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{item.service.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${item.service.price.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateQuantity(item.serviceId, Math.max(1, item.quantity - 1))
              }
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeItem(item.serviceId)}
            >
              ×
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-lg font-semibold">Total</p>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
        </div>
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? "Processing..." : "Checkout"}
        </Button>
      </div>
    </div>
  );
}
