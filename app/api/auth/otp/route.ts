import { NextResponse } from 'next/server';
import { generateOTP, verifyOTP } from '../otp';

export async function POST(req: Request) {
  const { action, inputOtp, actualOtp } = await req.json();

  if (action === 'generate') {
    const otp = generateOTP();
    return NextResponse.json({ otp }, { status: 200 });
  } else if (action === 'verify') {
    const isValid = verifyOTP(inputOtp, actualOtp);
    return NextResponse.json({ isValid }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
