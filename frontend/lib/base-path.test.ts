import { afterEach, describe, expect, it, vi } from "vitest";

describe("base-path asset URLs", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses root-relative assets by default", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { withBasePath } = await import("./base-path");
    expect(withBasePath("/brand/hugo-lockup.png")).toBe("/brand/hugo-lockup.png");
  });

  it("prefixes and normalizes configured deployments", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/operator/");
    const { withBasePath } = await import("./base-path");
    expect(withBasePath("brand/hugo-icon.png")).toBe("/operator/brand/hugo-icon.png");
  });
});
