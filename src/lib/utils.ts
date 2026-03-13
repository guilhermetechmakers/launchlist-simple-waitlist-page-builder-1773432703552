import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Null-safe map: (items ?? []).map(fn) */
export function safeMap<T, U>(items: T[] | null | undefined, fn: (item: T, index: number) => U): U[] {
  const list = items ?? [];
  return Array.isArray(list) ? list.map(fn) : [];
}

/** Null-safe filter: (items ?? []).filter(pred) */
export function safeFilter<T>(items: T[] | null | undefined, pred: (item: T, index: number) => boolean): T[] {
  const list = items ?? [];
  return Array.isArray(list) ? list.filter(pred) : [];
}

/** Slug generation: lowercase, replace spaces/special with hyphens */
export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
