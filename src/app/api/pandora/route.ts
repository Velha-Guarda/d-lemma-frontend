import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(_: NextRequest) {
  const token =
    _.headers.get('authorization') || _.headers.get('Authorization')

  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${API_URL}/pandora/random`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao sortear dilema' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Erro interno no proxy de Pandora:", err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
