import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('author_name')
      .not('author_name', 'eq', 'Treinador Desconhecido');

    const uniqueUsers = [...new Set(data?.map(item => item.author_name).filter(Boolean))];
    return NextResponse.json(uniqueUsers);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
