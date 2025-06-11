import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // Se o usuário está na página de login e já tem uma sessão, redireciona para a página de criação
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/create', request.url));
  }

  // Se o usuário está tentando acessar uma rota admin (que não seja a de login) e não tem sessão, redireciona para o login
  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Permite o acesso se nenhuma das condições acima for atendida
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 