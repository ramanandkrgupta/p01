import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import BookingForm from '@/components/BookingForm'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Service',
  description: 'Book professional services',
}

interface Props {
  params: {
    serviceid: string
  }
}

// Add generateStaticParams function
export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({
      select: { 
        id: true,
        name: true,
        duration: true
      }
    })
    
    return services.map((service) => ({
      serviceid: service.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [{ serviceid: '1' }] // Fallback to a default service ID
  }
}

export default async function BookingPage({ params }: Props) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch service details from database
  const serviceFromDb = await prisma.service.findUnique({
    where: {
      id: params.serviceid as string
    },
  })

  if (!serviceFromDb) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Service not found</h1>
      </div>
    )
  }

  // Map Prisma service to the expected type
  const service = {
    id: serviceFromDb.id,
    name: serviceFromDb.name,
    price: serviceFromDb.price as number,
    duration: serviceFromDb.duration
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book {service.name}</h1>
      <BookingForm service={service} userId={userId} />
    </div>
  )
}
