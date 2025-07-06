import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  // aguarda os parâmetros dinâmicos
  const { id, userId } = await params

  // repassa o header de autorização recebido do front
  const token = req.headers.get('authorization') || req.headers.get('Authorization')

  // chama o endpoint de remoção no backend
  const apiRes = await fetch(
    `${API_URL}/dilemmas/${id}/participants/${userId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    }
  )

  // se deu erro, retorna o mesmo status e mensagem
  if (!apiRes.ok) {
    const errorBody = await apiRes.json().catch(() => ({ error: 'Erro ao remover participante.' }))
    return NextResponse.json(errorBody, { status: apiRes.status })
  }

  // se backend devolveu 204 No Content ou 200 OK, respondemos com 200 e body vazio
  return NextResponse.json({}, { status: 200 })
}
