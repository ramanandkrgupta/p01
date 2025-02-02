'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

import { useUser } from '@clerk/nextjs'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    category: string
    price: number
    duration: number
  }
}

export default function ServiceCard({ service }: ServiceCardProps) 
{
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn, user } = useUser()

  


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-2">{service.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">₹{service.price}/hour</span>
          <span className="text-sm text-gray-500">{service.duration} min</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push(`/book/${service.id}`)}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Book Now
          </Button>
          
        </div>
      </div>
    </div>
  )
}
