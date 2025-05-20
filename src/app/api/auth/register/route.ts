import { NextRequest, NextResponse } from 'next/server';

// URL base da API
const API_URL = 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    // Obter o corpo da requisição
    const body = await request.json();
    console.log('Dados de registro:', body);
    
    // Encaminhar a requisição para a API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Status da resposta:', response.status);
    
    // Tentar obter o texto da resposta primeiro
    const responseText = await response.text();
    console.log('Resposta (texto):', responseText);
    
    // Se a resposta estiver vazia ou não for JSON, retornar um erro
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
        { message: data.message || 'Erro na requisição' },
        { status: response.status }
      );
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no endpoint de registro:', error);
    return NextResponse.json(
      { message: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 