import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // aguarda o parâmetro dinâmico
  const { id } = await params

  // repassa o header de autorização recebido do front
  const token = req.headers.get('authorization') || req.headers.get('Authorization')

  // chama o endpoint de listar participantes no backend
  const apiRes = await fetch(`${API_URL}/dilemmas/${id}/participants`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
  })

  // se deu erro, retorna o mesmo status e mensagem
  if (!apiRes.ok) {
    const errorBody = await apiRes.json().catch(() => ({ error: 'Erro ao listar participantes.' }))
    return NextResponse.json(errorBody, { status: apiRes.status })
  }

  // sucesso: retorna a lista de participantes
  const data = await apiRes.json()
  return NextResponse.json(data, { status: 200 })
}
