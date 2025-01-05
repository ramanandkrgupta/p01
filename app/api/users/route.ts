import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, name } = await req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
  }
}
