import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const body = await req.text();
  const apiRes = await fetch(`${API_URL}/dilemmas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': token } : {}),
    },
    body,
  });
  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
} 