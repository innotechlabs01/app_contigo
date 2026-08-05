export interface Occasion {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_color: string;
  icon_svg: string;
  sort_order: number;
}

export interface Message {
  id: string;
  occasion_id: string;
  text: string;
}

export interface Order {
  id: string;
  occasion: string;
  message_text: string;
  recipient_name: string;
  recipient_phone: string;
  sender_name: string;
  scheduled_date: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

export interface OrderDraft {
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  scheduledDate: string;
}
