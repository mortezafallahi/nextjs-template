import { getInitialQuestion } from '@/app/api/_lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const initialQuestion = getInitialQuestion();

    if (!initialQuestion) {
      return NextResponse.json(
        {
          status: false,
          data: null,
          message: 'سوال اولیه یافت نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: initialQuestion,
      message: 'سوال اولیه با موفقیت دریافت شد',
    });
  } catch (error) {
    console.error('Error fetching initial question:', error);
    return NextResponse.json(
      {
        status: false,
        data: null,
        message: 'خطا در دریافت سوال اولیه',
      },
      { status: 500 }
    );
  }
}
