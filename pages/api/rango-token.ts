import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      token: Buffer.from(`${Date.now()}:${crypto.randomUUID()}`).toString('base64'),
      expires: Date.now() + 300_000 // 5 minute validity
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate session token' },
      { status: 500 }
    );
  }
}
