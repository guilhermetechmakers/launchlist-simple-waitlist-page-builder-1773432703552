// Edge Function: publish project — set public_link and optionally bump branding_version.
// POST body: { projectId: string }. Requires auth; caller must be project owner.
// Returns { success: boolean; publicLink?: string; message?: string }.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

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

    const body = (await req.json().catch(() => ({}))) as { projectId?: string };
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    if (!projectId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing projectId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: project, error: fetchErr } = await supabase
      .from("projects")
      .select("id, slug, owner_user_id, branding_version")
      .eq("id", projectId)
      .single();

    if (fetchErr || !project) {
      return new Response(
        JSON.stringify({ success: false, message: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (project.owner_user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    const protocol = req.headers.get("x-forwarded-proto") ?? "https";
    const baseUrl = origin ? `${protocol}://${origin}` : Deno.env.get("PUBLIC_APP_URL") ?? "";
    const publicLink = baseUrl ? `${baseUrl}/r/${project.slug}` : "";

    const nextVersion = (project.branding_version ?? 0) + 1;

    const { error: updateErr } = await supabase
      .from("projects")
      .update({
        public_link: publicLink || null,
        branding_version: nextVersion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateErr) throw updateErr;

    return new Response(
      JSON.stringify({
        success: true,
        publicLink: publicLink || undefined,
        message: "Published",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
