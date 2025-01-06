"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const totalAmount = items.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  )

  const handlePayment = async () => {
    try {
      // Here you can integrate with your payment provider
      // For example, redirect to Stripe checkout
      
      // For now, we'll just simulate a successful payment
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase.",
      })
      clearCart()
      router.push("/payment-success")
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/services")}>
          Browse Services
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
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
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-medium">
                  ${(item.service.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handlePayment}
            >
              Pay Now
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/services")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
