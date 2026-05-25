import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Times encontrados no banco:', data?.length);

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
