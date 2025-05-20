import { NextRequest, NextResponse } from 'next/server';

// URL base da API
const API_URL = 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    // Obter o corpo da requisição
    const body = await request.json();
    console.log('Dados de login:', body);
    
    // Adaptar os dados para o formato esperado pelo backend
    const dadosParaEnvio = {
      email: body.email,
      password: body.senha || body.password // Aceita senha ou password
    };
    
    // Encaminhar a requisição para a API
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosParaEnvio),
    });
    
    console.log('Status da resposta:', response.status);
    
    // Tentar obter o texto da resposta primeiro
    const responseText = await response.text();
    console.log('Resposta (texto):', responseText);
    
    // Se a resposta estiver vazia, retornar um erro
    if (!responseText) {
      return NextResponse.json(
        { message: 'O servidor retornou uma resposta vazia' },
        { status: response.status }
      );
    }
    
    // Tentar converter a resposta para JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Erro ao analisar JSON:', error);
      return NextResponse.json(
        { message: 'O servidor retornou uma resposta inválida' },
        { status: response.status }
      );
    }
    
    // Se a resposta não for ok, retornar um erro
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Credenciais inválidas' },
        { status: response.status }
      );
    }
    
    // Formatar a resposta para o formato esperado pelo frontend
    const formattedResponse = {
      id: data.user?.id || data.id,
      nome: data.user?.name || data.name,
      email: data.user?.email || data.email,
      graduation: data.user?.graduation || data.graduation,
      role: data.user?.role || data.role,
      token: data.token
    };
    
    // Retornar os dados formatados
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Erro no endpoint de login:', error);
    return NextResponse.json(
      { message: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 