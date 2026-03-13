// Edge Function: return signed upload URL for logo (Supabase Storage).
// Requires auth; validates file type/size from request body.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      filename?: string;
      contentType?: string;
      size?: number;
    };
    const contentType = body.contentType ?? "image/png";
    if (!ALLOWED_TYPES.includes(contentType)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (typeof body.size === "number" && body.size > MAX_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "File too large" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ext = contentType.split("/")[1] ?? "png";
    const path = `logos/${user.id}/${crypto.randomUUID()}.${ext}`;

    const { data: signed, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(path);

    if (error) throw error;

    return new Response(
      JSON.stringify({ path, signedUrl: signed?.signedUrl, token: signed?.token }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
