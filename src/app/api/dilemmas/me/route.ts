import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const apiRes = await fetch(`${API_URL}/dilemmas/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': token } : {}),
    },
    // credentials: 'include' // se precisar cookies
  });
  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
} 