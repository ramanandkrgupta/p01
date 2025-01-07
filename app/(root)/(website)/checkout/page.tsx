"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect } from "react"

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to format current date and time
const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

// Function to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    // Redirect if not signed in or cart is empty
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access checkout",
        variant: "destructive",
      });
      router.push('/sign-in');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      router.push('/services');
      return;
    }

    console.log('Checkout page loaded with items:', items);
  }, [isSignedIn, items, router, toast]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  )

  const handlePayment = async () => {
    try {
      console.log('Processing payment for items:', items);

      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create Razorpay order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 1.1, // Including tax
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'ServeEase',
        description: 'Service Booking Payment',
        order_id: data.id,
        handler: async function (response: any) {
          try {
            // Get necessary details for WhatsApp notification
            const service = items[0].service;
            const otp = generateOTP();
            const dateTime = formatDateTime();
            const expertName = "Professional Expert";

            // Get phone number from user's metadata or primary phone
            const phoneNumber = user?.primaryPhoneNumber?.phoneNumber || user?.phoneNumbers?.[0]?.phoneNumber;
            
            if (!phoneNumber) {
              toast({
                title: "Missing Phone Number",
                description: "Please add a phone number to your profile to receive booking confirmations.",
                variant: "destructive",
              });
              return;
            }

            // Format phone number (remove '+' and ensure it starts with country code)
            const formattedPhone = phoneNumber.replace(/\D/g, '');
            const finalPhone = formattedPhone.startsWith('91') 
              ? formattedPhone 
              : `91${formattedPhone}`;

            console.log('Sending WhatsApp notification...', {
              serviceName: service.name,
              dateTime,
              expertName,
              phoneLength: finalPhone.length
            });

            // Send WhatsApp notification
            const notificationResponse = await fetch('/api/whatsapp-notification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phoneNumber: finalPhone,
                serviceName: service.name,
                dateTime: dateTime,
                expertName: expertName,
                otp: otp,
              }),
            });

            if (!notificationResponse.ok) {
              const error = await notificationResponse.json();
              throw new Error(error.error || 'Failed to send booking confirmation');
            }

            // Show success message
            toast({
              title: "Payment Successful!",
              description: "Check your WhatsApp for booking details.",
            });

            // Clear cart only after successful notification
            clearCart();
            
            // Redirect to success page
            router.push("/payment-success");
          } catch (error) {
            console.error('Notification error:', error);
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to send booking confirmation",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
          contact: user?.primaryPhoneNumber?.phoneNumber || '',
        },
        theme: {
          color: '#0F172A',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment/Notification error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      });
    }
  };

  // Don't render anything while checking auth status
  if (!isSignedIn || items.length === 0) {
    return null;
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
                  ₹{(item.service.price * item.quantity).toFixed(2)}
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
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{(totalAmount * 1.1).toFixed(2)}</span>
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
