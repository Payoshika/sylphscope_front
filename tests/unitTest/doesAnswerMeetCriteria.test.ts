import { describe, it, expect } from "vitest";
import { doesAnswerMeetCriteria } from "../../src/utility/CriteriaUtils";

// Files referenced:
// - doesAnswerMeetCriteria: ../../src/utility/CriteriaUtils.ts

describe("doesAnswerMeetCriteria - dates and numbers", () => {
  it("returns true for date equals when answer is an array of date objects", () => {
    const answer = [{ day: "21", month: "07", year: "2025" }];
    const values = [{ day: "21", month: "07", year: "2025" }];
    expect(doesAnswerMeetCriteria(answer, "equals" as any, values)).toBe(true);
  });

  it("handles greater_than for date answers", () => {
    const answer = [{ day: "22", month: "07", year: "2025" }];
    const values = [{ day: "21", month: "07", year: "2025" }];
    expect(doesAnswerMeetCriteria(answer, "greater_than" as any, values)).toBe(true);
  });

  it("handles numeric comparisons", () => {
    expect(doesAnswerMeetCriteria(10, "greater_than" as any, [5])).toBe(true);
    expect(doesAnswerMeetCriteria(3, "less_than_or_equal" as any, [3])).toBe(true);
  });

  it("handles in_list and not_in_list", () => {
    expect(doesAnswerMeetCriteria(["a", "b"], "in_list" as any, ["b"])).toBe(true);
    expect(doesAnswerMeetCriteria("x", "not_in_list" as any, ["a", "b"])).toBe(true);
  });
});