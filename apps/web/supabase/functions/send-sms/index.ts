import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.cron("send-scheduled-sms", "0 18 * * *", async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_date", today);

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  if (!orders?.length) {
    console.log("No pending orders for today");
    return;
  }

  console.log(`Found ${orders.length} pending orders to send`);

  for (const order of orders) {
    try {
      // TODO: Integrate Twilio or SMS provider here
      await supabase
        .from("orders")
        .update({ status: "sent" })
        .eq("id", order.id);

      console.log(
        `[SMS] Sent to ${order.recipient_name} (${order.recipient_phone}): ${order.message_text.slice(0, 50)}...`,
      );
    } catch (err) {
      console.error(`Failed to send SMS for order ${order.id}:`, err);
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
    }
  }
});
