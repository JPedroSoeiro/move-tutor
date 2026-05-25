import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Usuário criado!', user: data.user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
