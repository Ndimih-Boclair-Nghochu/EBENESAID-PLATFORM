import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('eb_session')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully.' },
      { status: 200 }
    );

    response.cookies.delete('eb_session');
    return response;
  } catch (error: unknown) {
    console.error('Logout error:', error);
    const response = NextResponse.json(
      { message: 'Logged out.' },
      { status: 200 }
    );
    response.cookies.delete('eb_session');
    return response;
  }
}
