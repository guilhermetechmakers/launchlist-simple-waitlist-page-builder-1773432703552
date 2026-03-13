/**
 * Unit tests for slugify and runtime safety (guarded array/slug usage).
 */

import { describe, it, expect } from "vitest";
import { slugify, isValidSlug, getSlugError } from "./slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("My Product")).toBe("my-product");
    expect(slugify("My Awesome App")).toBe("my-awesome-app");
  });

  it("strips non [a-z0-9-] and collapses hyphens", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
    expect(slugify("a---b")).toBe("a-b");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  foo bar  ")).toBe("foo-bar");
    expect(slugify("--test--")).toBe("test");
  });

  it("returns 'waitlist' for empty or blank input", () => {
    expect(slugify("")).toBe("waitlist");
    expect(slugify("   ")).toBe("waitlist");
  });

  it("handles null/undefined safely", () => {
    expect(slugify(null as unknown as string)).toBe("");
    expect(slugify(undefined as unknown as string)).toBe("");
  });
});

describe("isValidSlug", () => {
  it("accepts valid slugs", () => {
    expect(isValidSlug("my-product")).toBe(true);
    expect(isValidSlug("waitlist-1")).toBe(true);
    expect(isValidSlug("a")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("My Product")).toBe(false);
    expect(isValidSlug("foo_bar")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug(null as unknown as string)).toBe(false);
  });
});

describe("getSlugError", () => {
  it("returns null for valid slug", () => {
    expect(getSlugError("my-product")).toBe(null);
  });

  it("returns message for empty slug", () => {
    expect(getSlugError("")).toBe("URL slug is required");
  });

  it("returns message for invalid characters", () => {
    expect(getSlugError("my product")).not.toBe(null);
    expect(getSlugError("UPPER")).not.toBe(null);
  });
});
