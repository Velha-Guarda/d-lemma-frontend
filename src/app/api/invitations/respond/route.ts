import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const body = await req.text();
  const apiRes = await fetch(`${API_URL}/invitations/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': token } : {}),
    },
    body,
  });

  // Tenta parsear como JSON, se falhar retorna como texto
  const text = await apiRes.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  return NextResponse.json(data, { status: apiRes.status });
} 