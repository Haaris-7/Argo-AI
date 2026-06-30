import { describe, expect, it } from "vitest";
import { ApiError, apiErrorMessage, compactNumber, learningModeLabel, money, nextActionLabel, titleCase } from "./utils";

describe("operator formatting", () => {
  it("formats money without unnecessary decimals", () => {
    expect(money(120_000)).toBe("$1,200");
    expect(money(12_345)).toBe("$123.45");
  });

  it("formats compact results and machine statuses", () => {
    expect(compactNumber(31_500)).toBe("31.5K");
    expect(titleCase("awaiting_approval")).toBe("Awaiting Approval");
  });

  it("keeps experimental learning explicit", () => {
    expect(learningModeLabel("database")).toBe("Database learning");
    expect(learningModeLabel("database_and_skill_patch")).toBe("Database + experimental patch");
  });

  it("derives readable next actions", () => {
    expect(nextActionLabel("approve_service_spend")).toBe("Approve service spend");
    expect(nextActionLabel("custom_review")).toBe("Custom Review");
  });
});

describe("API error mapping", () => {
  it("explains stale conflicts", () => {
    expect(apiErrorMessage(new ApiError(409, "Campaign changed."))).toContain("Reload the latest campaign state");
  });

  it("preserves validation feedback", () => {
    expect(apiErrorMessage(new ApiError(422, "Budget is required"))).toBe("Budget is required");
  });
});
