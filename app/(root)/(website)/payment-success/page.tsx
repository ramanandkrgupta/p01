"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your services have been booked successfully.
      </p>
      <Button size="lg" onClick={() => router.push("/services")}>
        Browse More Services
      </Button>
    </div>
  )
}
