import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, product, quantity } = await req.json();
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        product,
        quantity,
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
