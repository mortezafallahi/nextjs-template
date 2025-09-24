import { store } from '@/app/api/_lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { first_name, last_name } = body;

    // Validation
    if (!first_name || !last_name) {
      return NextResponse.json(
        {
          status: false,
          message: 'نام و نام خانوادگی الزامی است',
        },
        { status: 400 }
      );
    }

    // Update user
    const user = store.users.get(decoded.mobile);
    if (user) {
      user.first_name = first_name;
      user.last_name = last_name;
      user.fullname = `${first_name} ${last_name}`;
      user.status = {
        key: 'COMPLETE',
        value: 'تکمیل شده',
      };
      user.updated_at = new Date().toISOString();
      store.users.set(decoded.mobile, user);

      console.log(`✅ Profile completed for ${decoded.mobile}`);
    }

    return NextResponse.json({
      status: true,
      data: {},
      message: 'اطلاعات با موفقیت بروزرسانی شد',
    });
  } catch (error) {
    console.error('Error in complete-profile:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'خطای سرور',
      },
      { status: 500 }
    );
  }
}
