import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const token =
    req.headers.get('authorization') || req.headers.get('Authorization')

  const apiRes = await fetch(`${API_URL}/api/chats/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
  })

  if (!apiRes.ok) {
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens do chat.' },
      { status: apiRes.status }
    )
  }

  const data = await apiRes.json()
  return NextResponse.json(data, { status: 200 })
}
