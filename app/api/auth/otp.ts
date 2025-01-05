export function generateOTP(): string {
  // Logic to generate OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function verifyOTP(inputOtp: string, actualOtp: string): boolean {
  // Logic to verify OTP
  return inputOtp === actualOtp;
}
