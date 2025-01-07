"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-muted-foreground mb-4">
        Thank you for choosing our services.
      </p>
      <p className="text-muted-foreground mb-8">
        Your booking details have been sent to your WhatsApp.
      </p>
      <Button size="lg" onClick={() => router.push("/services")}>
        Browse More Services
      </Button>
    </div>
  )
}
