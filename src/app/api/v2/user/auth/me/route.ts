import { store } from '@/app/api/_lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          status: false,
          message: 'توکن احراز هویت یافت نشد',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        {
          status: false,
          message: 'توکن نامعتبر',
        },
        { status: 401 }
      );
    }

    // Get user
    const user = store.users.get(decoded.mobile);
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: 'کاربر یافت نشد',
        },
        { status: 404 }
      );
    }

    console.log(
      `🔍 User data retrieved for ${decoded.mobile}, status: ${user.status.key}`
    );

    return NextResponse.json({
      status: true,
      data: user,
      message: 'اطلاعات کاربر دریافت شد',
    });
  } catch (error) {
    console.error('Error in auth/me:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'خطای سرور',
      },
      { status: 500 }
    );
  }
}
