import { describe, expect, it } from "vitest";
import {
  COUNTRY_CODE,
  detectOperator,
  KNOWN_PREFIXES,
  LOCAL_NUMBER_LENGTH,
  OPERATOR_PREFIXES,
} from "./operators";

describe("operator constants", () => {
  it("exposes the documented prefix table", () => {
    expect(OPERATOR_PREFIXES).toEqual({
      Grameenphone: ["017", "013"],
      Banglalink: ["019", "014"],
      Robi: ["018"],
      Airtel: ["016"],
      Teletalk: ["015"],
    });
  });

  it("has no duplicate prefixes across operators", () => {
    expect(new Set(KNOWN_PREFIXES).size).toBe(KNOWN_PREFIXES.length);
  });

  it("exposes the local length and country code", () => {
    expect(LOCAL_NUMBER_LENGTH).toBe(11);
    expect(COUNTRY_CODE).toBe("+880");
  });
});

describe("detectOperator", () => {
  it("resolves every known prefix", () => {
    for (const prefix of KNOWN_PREFIXES) {
      expect(detectOperator(`${prefix}11111111`)).not.toBe("Unknown");
    }
  });

  it("returns Unknown for an unlisted prefix", () => {
    expect(detectOperator("01211111111")).toBe("Unknown");
  });

  it("returns Unknown when fewer than three digits are known", () => {
    expect(detectOperator("01")).toBe("Unknown");
    expect(detectOperator("")).toBe("Unknown");
  });
});
