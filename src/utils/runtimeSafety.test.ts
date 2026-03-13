/**
 * Runtime safety: guarded array usage and default values.
 */

import { describe, it, expect } from "vitest";

describe("runtime safety patterns", () => {
  it("(items ?? []).map returns array", () => {
    const items: string[] | null | undefined = ["a", "b"];
    const result = (items ?? []).map((x) => x.toUpperCase());
    expect(result).toEqual(["A", "B"]);
  });

  it("(items ?? []).map handles null", () => {
    const items: string[] | null = null;
    const result = (items ?? []).map((x) => x);
    expect(result).toEqual([]);
  });

  it("(items ?? []).map handles undefined", () => {
    const items: string[] | undefined = undefined;
    const result = (items ?? []).map((x) => x);
    expect(result).toEqual([]);
  });

  it("Array.isArray check before map", () => {
    const data: unknown = { items: [1, 2, 3] };
    const list = Array.isArray((data as { items?: number[] })?.items)
      ? (data as { items: number[] }).items
      : [];
    expect(list).toEqual([1, 2, 3]);
  });

  it("destructuring with defaults", () => {
    const response: { items?: string[]; count?: number } = {};
    const { items = [], count = 0 } = response ?? {};
    expect(items).toEqual([]);
    expect(count).toBe(0);
  });
});
