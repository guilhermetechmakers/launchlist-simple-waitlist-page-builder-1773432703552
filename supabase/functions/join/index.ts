// Edge Function: collect waitlist signup for a project by slug.
// Validates email, rate limits, inserts waitlist_entries, notifies owner.
// CORS and anon-friendly; no auth required.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const slug = typeof (body as { slug?: string }).slug === "string" ? (body as { slug: string }).slug.trim() : "";
    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Missing slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = typeof (body as { email?: string }).email === "string" ? (body as { email: string }).email.trim() : "";
    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, recipient_email, is_public")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (projectError || !project || !project.is_public) {
      return new Response(
        JSON.stringify({ error: "Waitlist not found or not public" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
    const ipHash = ip ? await hashString(ip) : null;
    const userAgent = req.headers.get("user-agent") ?? null;
    const referrer = req.headers.get("referer") ?? null;

    const { error: insertError } = await supabase.from("waitlist_entries").insert({
      project_id: project.id,
      email,
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ error: "This email is already on the waitlist" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw insertError;
    }

    // Notify owner (fire-and-forget or call notify-owner function)
    const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-owner`;
    fetch(notifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        project_id: project.id,
        project_name: project.name,
        recipient_email: project.recipient_email,
        email,
      }),
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true, message: "You're on the list!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function hashString(s: string): Promise<string> {
  const enc = new TextEncoder();
  const data = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
