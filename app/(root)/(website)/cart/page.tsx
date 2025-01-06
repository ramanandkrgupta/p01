'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'

interface CartItem {
  id: string
  quantity: number
  service: {
    id: string
    name: string
    price: number
    duration: number
    imageUrl: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const router = useRouter()
  const { userId, isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn) {
      fetchCartItems()
    } else {
      setLoading(false)
    }
  }, [isSignedIn])

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to fetch cart items')
      }
      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error(error instanceof Error ? error.message : 'Error fetching cart items')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to remove item')
      }

      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error(error instanceof Error ? error.message : 'Error removing item')
    }
  }

  const handleCheckout = async () => {
    try {
      setCheckingOut(true)
      
      // Create bookings for each cart item
      for (const item of cartItems) {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: item.service.id,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            totalAmount: item.service.price * item.quantity,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error || 'Failed to create booking')
        }
      }

      // Clear cart items
      for (const item of cartItems) {
        await removeFromCart(item.id)
      }

      toast.success('Checkout successful!')
      router.push('/bookings')
    } catch (error) {
      console.error('Error during checkout:', error)
      toast.error(error instanceof Error ? error.message : 'Error during checkout')
    } finally {
      setCheckingOut(false)
    }
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  )

  if (!isSignedIn) {
    return (
      <div className="container py-10">
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Please sign in to view your cart</p>
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading your cart...</div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => router.push('/services')}>
            Browse Services
          </Button>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 relative">
                    <img
                      src={item.service.imageUrl}
                      alt={item.service.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.service.name}</h3>
                    <p className="text-gray-500">
                      ₹{item.service.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">
                    ₹{item.service.price * item.quantity}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    disabled={checkingOut}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-semibold">₹{totalAmount}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing Checkout...' : 'Proceed to Checkout'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
