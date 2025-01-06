import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'


// Add item to cart
export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)
    if (!clerkUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Get or create database user
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
      const firstName = clerkUser.firstName || ''
      const lastName = clerkUser.lastName || ''
      
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: firstName ? `${firstName} ${lastName}`.trim() : ''
        }
      })
    }

    const body = await req.json()
    const { serviceId, quantity = 1 } = body

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: dbUser.id }
      })
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        serviceId
      }
    })

    let cartItem
    if (existingCartItem) {
      // Update quantity if item exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity
        },
        include: {
          service: true
        }
      })
    } else {
      // Add new item to cart
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          serviceId,
          quantity
        },
        include: {
          service: true
        }
      })
    }

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('[CART_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// Get cart items
export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const clerkUser = await clerkClient.users.getUser(userId)
    if (!clerkUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
      const firstName = clerkUser.firstName || ''
      const lastName = clerkUser.lastName || ''
      
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: firstName ? `${firstName} ${lastName}`.trim() : ''
        }
      })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: {
            service: true
          }
        }
      }
    })

    return NextResponse.json(cart?.items || [])
  } catch (error) {
    console.error('[CART_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const clerkUser = await clerkClient.users.getUser(userId)
    if (!clerkUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
      const firstName = clerkUser.firstName || ''
      const lastName = clerkUser.lastName || ''
      
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: firstName ? `${firstName} ${lastName}`.trim() : ''
        }
      })
    }

    const { searchParams } = new URL(req.url)
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return new NextResponse('Cart item ID required', { status: 400 })
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    })

    if (!cartItem || cartItem.cart.userId !== dbUser.id) {
      return new NextResponse('Cart item not found', { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CART_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
