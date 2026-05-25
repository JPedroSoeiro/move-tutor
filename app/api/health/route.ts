import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Move Tutor API Online! 🚀' });
}
