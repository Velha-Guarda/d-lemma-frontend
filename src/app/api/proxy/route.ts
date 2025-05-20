import { NextRequest, NextResponse } from 'next/server';

// URL base da API
const API_URL = 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    // Obter URL completa e extrair o caminho
    const url = new URL(request.url);
    console.log('URL original:', url.toString());
    
    // Extrair o caminho da API após /api/proxy
    // Usando uma abordagem mais robusta para obter o caminho
    const pathParts = url.pathname.split('/api/proxy');
    const apiPath = pathParts.length > 1 ? pathParts[1] : '';
    
    // Reconstruir a URL completa da API
    const targetUrl = `${API_URL}${apiPath}`;
    console.log('URL alvo:', targetUrl);
    
    // Obter o corpo da requisição
    const body = await request.json();
    console.log('Corpo da requisição:', body);
    
    // Encaminhar a requisição para a API
    const apiResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Log do status da resposta
    console.log('Status da resposta:', apiResponse.status);
    
    // Se não for possível converter para JSON (não é JSON válido)
    const contentType = apiResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await apiResponse.text();
      console.error('Resposta não-JSON:', textResponse);
      return NextResponse.json(
        { message: 'O servidor retornou uma resposta inválida' },
        { status: apiResponse.status }
      );
    }
    
    // Obter a resposta como JSON
    const data = await apiResponse.json();
    
    // Se a resposta não for ok, retornar um erro
    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro na requisição' },
        { status: apiResponse.status }
      );
    }
    
    // Retornar os dados da API
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no proxy:', error);
    return NextResponse.json(
      { message: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/api/proxy');
    const apiPath = pathParts.length > 1 ? pathParts[1] : '';
    const targetUrl = `${API_URL}${apiPath}`;
    
    console.log('GET para URL:', targetUrl);
    
    const apiResponse = await fetch(targetUrl);
    
    // Se não for possível converter para JSON (não é JSON válido)
    const contentType = apiResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await apiResponse.text();
      console.error('Resposta não-JSON:', textResponse);
      return NextResponse.json(
        { message: 'O servidor retornou uma resposta inválida' },
        { status: apiResponse.status }
      );
    }
    
    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro na requisição' },
        { status: apiResponse.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no proxy GET:', error);
    return NextResponse.json(
      { message: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 