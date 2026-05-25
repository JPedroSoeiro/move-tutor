import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
}

export async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Token não fornecido ou malformatado' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error('Inválido');

    return {
      authenticated: true,
      user,
      response: null,
    };
  } catch (err) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Sessão expirada ou inválida' },
        { status: 401 }
      ),
    };
  }
}
