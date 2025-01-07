"use client"
import ServiceCard from '@/components/ServiceCard'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

const services = [
  {
    id: '1',
    name: 'House Cleaning',
    description: 'Professional house cleaning services',
    imageUrl: '/images/cleaning.jpg',
    category: 'Cleaning',
    price: 25.99,
    duration: 60,
  },
  {
    id: '2',
    name: 'AC Repair',
    description: 'Expert AC repair and maintenance',
    imageUrl: '/images/ac-repair.jpg',
    category: 'Repair',
    price: 45.99,
    duration: 60,
  },
  {
    id: '3',
    name: 'Salon Services',
    description: 'Professional beauty and grooming services',
    imageUrl: '/images/salon.jpg',
    category: 'Beauty',
    price: 35.99,
    duration: 60,
  },
  {
    id: '4',
    name: 'Electrician',
    description: 'Licensed electrician for all electrical needs',
    imageUrl: '/images/electrician.jpg',
    category: 'Repair',
    price: 40.99,
    duration: 60,
  },
]

export default function ServicesPage() {
  const { items, addItem } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { isSignedIn, user } = useUser()

  const handleAddToCart = (service: typeof services[0]) => {
    console.log('Adding to cart:', service);
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      router.push('/sign-in');
      return;
    }

    addItem(service.id, {
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      imageUrl: service.imageUrl,
    })

    console.log('Current cart items:', items);

    toast({
      title: "Added to cart",
      description: `${service.name} has been added to your cart.`,
    })
  }

  const handleCheckout = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed to checkout",
        variant: "destructive",
      });
      router.push('/sign-in');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add some services to your cart first",
        variant: "destructive",
      });
      return;
    }

    console.log('Proceeding to checkout with items:', items);
    router.push('/checkout');
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Professional Home Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col">
            <ServiceCard service={service} />
            <Button 
              onClick={() => handleAddToCart(service)}
              className="mt-2"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-lg font-bold">
                Total: ${totalAmount.toFixed(2)}
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={handleCheckout}
            >
              Proceed to Checkout ({items.length} items)
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
