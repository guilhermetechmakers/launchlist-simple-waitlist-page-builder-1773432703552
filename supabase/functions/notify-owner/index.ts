// Edge Function: send email to project owner when someone joins waitlist.
// Uses SendGrid/Postmark via env; stub implementation logs and returns OK.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { project_name, recipient_email, email } = body as {
      project_id?: string;
      project_name?: string;
      recipient_email?: string;
      email?: string;
    };

    if (!recipient_email || !email) {
      return new Response(
        JSON.stringify({ error: "Missing recipient_email or email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // TODO: integrate SendGrid/Postmark with DENO.env.get("SENDGRID_API_KEY") or similar
    // For now, log and return success so join flow does not block
    console.log("Notify owner:", { project_name, recipient_email, email });

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
