import { NextRequest, NextResponse } from 'next/server';

// Mock database for OTPs
const otpStore = new Map<string, { code: string; expireAt: number }>();

// کد OTP ثابت برای تست
const FIXED_OTP_CODE = '4567';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;

    // Validation
    if (!mobile) {
      return NextResponse.json(
        {
          data: {
            validation: [
              {
                type: 'field',
                msg: 'فیلد تلفن همراه ضروری است',
                path: 'mobile',
                location: 'body',
              },
            ],
          },
          status: false,
          message: 'validation error',
        },
        { status: 400 }
      );
    }

    // استفاده از کد ثابت برای تست
    const otp = FIXED_OTP_CODE;
    const expireAt = 120; // 2 minutes

    // Store OTP
    otpStore.set(mobile, {
      code: otp,
      expireAt: Date.now() + expireAt * 1000,
    });

    // Log OTP for testing
    console.log(`🔐 OTP Code for ${mobile}: ${otp}`);
    console.log('✅ برای تست از کد 4567 استفاده کنید');

    return NextResponse.json({
      status: true,
      data: {
        identifier: mobile,
        user_exists: true,
        expireAt: expireAt,
      },
      message: 'کد فعال‌سازی ارسال شد',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: 'خطای سرور',
      },
      { status: 500 }
    );
  }
}
