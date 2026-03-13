export interface WaitlistEntry {
  id: string;
  project_id: string;
  email: string;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
