// ...existing code...
// Mock modules before importing them so imports use the mocks
vi.mock("../../src/utility/ApiClient", () => ({ apiClient: { post: vi.fn(), get: vi.fn() } }));
vi.mock("../../src/utility/TokenManager", () => ({
  tokenManager: {
    setToken: vi.fn(),
    setUser: vi.fn(),
    getUser: vi.fn(),
    hasToken: vi.fn(),
    getToken: vi.fn(),
    clearAll: vi.fn(),
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthService from "../../src/services/AuthService";
import { apiClient } from "../../src/utility/ApiClient";
import { tokenManager } from "../../src/utility/TokenManager";

describe("AuthService", () => {
  beforeEach(() => {
    (apiClient.post as any).mockReset();
    (apiClient.get as any).mockReset();
    (tokenManager.setToken as any).mockReset?.();
    (tokenManager.hasToken as any).mockReset?.();
    (tokenManager.getUser as any).mockReset?.();
    (tokenManager.getToken as any).mockReset?.();
    (tokenManager.clearAll as any).mockReset?.();
  });

  it("login stores token on success", async () => {
    (apiClient.post as any).mockResolvedValue({ success: true, data: { id: "u1", token: "t" } });
    const res = await AuthService.login({ username: "a", password: "b" } as any);
    expect(res.success).toBe(true);
    expect(tokenManager.setToken).toHaveBeenCalledWith("t");
  });

  it("validateSession returns mfa_required when backend signals", async () => {
    (tokenManager.hasToken as any).mockReturnValue(true);
    (apiClient.get as any).mockResolvedValue({ success: false, message: "MFA verification required", data: null });
    const val = await AuthService.validateSession();
    expect(val).toBe("mfa_required");
  });
});