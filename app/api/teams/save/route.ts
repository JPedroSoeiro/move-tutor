import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { authenticate } from '@/lib/middleware/auth';

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await authenticate(request);

  if (!auth.authenticated) {
    return auth.response as Response;
  }

  try {
    const user = auth.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log('METADATA DO USUARIO:', user.user_metadata);

    const userName = user.user_metadata?.name || user.user_metadata?.full_name || 'Treinador';

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          ...body,
          user_id: user.id,
          author_name: userName,
        },
      ])
      .select();

    if (error) {
      console.error('ERRO SUPABASE AO SALVAR:', error);
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error('ERRO CRITICO:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
