import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occasion, messageText, recipientName, recipientPhone, senderName, scheduledDate } = body;

    if (!occasion || !messageText || !recipientName || !recipientPhone || !senderName || !scheduledDate) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        occasion,
        message_text: messageText,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        sender_name: senderName,
        scheduled_date: scheduledDate,
        status: 'pending',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
