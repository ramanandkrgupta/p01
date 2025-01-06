"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import toast from 'react-hot-toast'

interface BookingFormProps {
  service: {
    id: string
    name: string
    price: number
    duration: number
  }
  userId: string
}

export default function BookingForm({ service, userId }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          userId,
          date,
          time,
          totalAmount: service.price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      toast.success('Booking created successfully!')
      router.push('/bookings')
    } catch (error) {
      toast.error('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold">
          Total: ₹{service.price} ({service.duration} minutes)
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}
