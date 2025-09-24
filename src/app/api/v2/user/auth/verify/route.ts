import { store } from '@/app/api/_lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// کد OTP ثابت برای تست
const FIXED_OTP_CODE = '4567';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, code } = body;

    // Validation
    if (!mobile || !code) {
      return NextResponse.json(
        {
          status: false,
          message: 'شماره موبایل و کد تایید الزامی است',
        },
        { status: 400 }
      );
    }

    // بررسی کد OTP ثابت
    if (code !== FIXED_OTP_CODE) {
      return NextResponse.json(
        {
          status: false,
          message: 'کد تایید نامعتبر یا منقضی شده است',
        },
        { status: 400 }
      );
    }

    // Get or create user
    let user = store.users.get(mobile);
    if (!user) {
      // برای کاربران جدید، وضعیت PENDING تنظیم می‌شود
      user = {
        id: Math.floor(Math.random() * 10000),
        uuid: crypto.randomUUID(),
        first_name: '',
        last_name: '',
        mobile: mobile,
        active: true,
        status: {
          key: 'PENDING',
          value: 'در انتظار تکمیل',
        },
        birthday: '1995-09-13T00:00:00.000Z',
        avatar: null,
        place_type: {
          key: 'PUBLIC',
          value: 'عمومی',
        },
        balance: 0,
      };
      store.users.set(mobile, user);
      console.log(`👤 New user created with mobile: ${mobile}`);
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, mobile: user.mobile, type: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`🔑 Token generated for ${mobile}, status: ${user.status.key}`);

    return NextResponse.json({
      status: true,
      data: {
        token: token,
        user: user,
      },
      message: 'ورود موفقیت‌آمیز',
    });
  } catch (error) {
    console.error('Error in auth/verify:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'خطای سرور',
      },
      { status: 500 }
    );
  }
}
