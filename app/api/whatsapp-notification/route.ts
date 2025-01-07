import { NextResponse } from 'next/server';

const AISENSY_API_KEY = process.env.AISENSY_API_KEY;
const AISENSY_API_URL = 'https://backend.aisensy.com/campaign/t1/api/v2';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { phoneNumber, serviceName, dateTime, expertName, otp } = body;

    // Validate required fields
    if (!phoneNumber || !serviceName || !dateTime || !expertName || !otp) {
      console.error('Missing required fields:', { phoneNumber, serviceName, dateTime, expertName, otp });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('API Key:', AISENSY_API_KEY?.substring(0, 10) + '...');
    
    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: "order_confirmed",
      destination: phoneNumber,
      userName: "ServeEase",
      templateParams: [
        serviceName,    // Service name
        dateTime,       // Date and time
        expertName,     // Service expert name
        otp,           // OTP for verification
      ],
      source: "service-booking",
      media: {},
      buttons: [],
      carouselCards: [],
      location: {},
      paramsFallbackValue: {
        FirstName: "Customer"
      }
    };

    console.log('Sending request to AISensy with payload:', payload);

    const response = await fetch(AISENSY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('AISensy API response:', responseData);

    if (!response.ok) {
      throw new Error(`Failed to send WhatsApp notification: ${JSON.stringify(responseData)}`);
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send WhatsApp notification' },
      { status: 500 }
    );
  }
}
