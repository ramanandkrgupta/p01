import { NextResponse } from 'next/server'
import  {prisma}  from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { serviceId, userId, date, time, totalAmount } = body

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        userId,
        date: new Date(date),
        startTime: new Date(`${date}T${time}`),
        totalAmount,
        status: 'confirmed',
      },
      include: {
        user: true,
        service: true,
      },
    })

    // Send WhatsApp notification
    await sendWhatsAppNotification(booking)

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

async function sendWhatsAppNotification(booking: any) {
  try {
    const message = `New booking confirmed!
Service: ${booking.service.name}
Date: ${booking.date.toLocaleDateString()}
Time: ${booking.startTime.toLocaleTimeString()}
Total: $${booking.totalAmount}
Status: ${booking.status}`

    // Replace with your WhatsApp API integration
    // Example using WhatsApp Business API
    await fetch(process.env.WHATSAPP_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: process.env.ADMIN_WHATSAPP_NUMBER,
        type: 'text',
        text: {
          body: message,
        },
      }),
    })
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}
