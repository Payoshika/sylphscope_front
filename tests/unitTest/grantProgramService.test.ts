import { describe, it, expect, vi, beforeEach } from "vitest";
import * as svc from "../../src/services/GrantProgramService";
import { apiClient } from "../../src/utility/ApiClient";

vi.mock("../../src/utility/ApiClient", () => ({ apiClient: { get: vi.fn(), put: vi.fn(), post: vi.fn() } }));

describe("GrantProgramService wrappers", () => {
  beforeEach(() => {
    (apiClient.get as any).mockReset();
  });

  it("getGrantProgramById throws when missing data", async () => {
    (apiClient.get as any).mockResolvedValue({ data: null });
    await expect(svc.getGrantProgramById("1")).rejects.toThrow();
  });

  it("getGrantProgramsByStudentId returns content", async () => {
    (apiClient.get as any).mockResolvedValue({ data: { content: [{ id: "g1" }], totalElements: 1, totalPages: 1, number: 0 } });
    const res = await svc.getGrantProgramsByStudentId("s1");
    expect(res.content).toBeDefined();
  });
});