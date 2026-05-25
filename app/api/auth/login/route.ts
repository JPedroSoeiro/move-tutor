import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    const user = {
      id: data.session?.user.id,
      email: data.session?.user.email,
      full_name: data.session?.user.user_metadata?.full_name,
    };

    return NextResponse.json({
      message: 'Logado!',
      session: data.session,
      user: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
