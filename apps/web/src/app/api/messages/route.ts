import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const { searchParams } = new URL(request.url);
  const occasionId = searchParams.get('occasion_id');

  if (!occasionId) {
    return NextResponse.json({ error: 'occasion_id is required' }, { status: 400 });
  }

  const url = `${supabaseUrl}/rest/v1/messages?occasion_id=eq.${occasionId}&limit=5&order=created_at.desc`;

  const res = await fetch(url, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
