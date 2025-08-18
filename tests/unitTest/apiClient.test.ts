// ...existing code...
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient } from "../../src/utility/ApiClient";

// Files referenced:
// - apiClient: ../../src/utility/ApiClient.tsx

describe("apiClient basic request handling", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    (global as any).fetch = originalFetch;
  });

  it("parses successful GET response and returns data", async () => {
    // Return JSON payload directly (apiClient.request returns the parsed json as `data`)
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hello: "world" }),
    });

    const res = await apiClient.get("/test-endpoint");
    expect(res.data).toEqual({ hello: "world" });
    expect(res.success).toBe(true);
  });

  it("returns error ApiResponse when fetch returns non-ok", async () => {
    // apiClient.request handles non-ok by returning { data: null, success: false, message: ... }
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal server error",
    });

    const res = await apiClient.get("/bad");
    expect(res.success).toBe(false);
    expect(res.data).toBeNull();
    expect(typeof res.message).toBe("string");
  });
});