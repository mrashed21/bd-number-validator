import { describe, expect, it } from "vitest";
import {
  normalizePhoneNumber,
  sanitizePhoneNumber,
  toInputDigits,
  toLocalNumber,
} from "./normalize-phone-number";

describe("sanitizePhoneNumber", () => {
  it("keeps only ASCII digits", () => {
    expect(sanitizePhoneNumber("+880 17-8113 1905")).toBe("8801781131905");
    expect(sanitizePhoneNumber("(017) 8113.1905")).toBe("01781131905");
    expect(sanitizePhoneNumber("abc")).toBe("");
    expect(sanitizePhoneNumber("")).toBe("");
  });

  it("drops non-Latin digits it cannot interpret", () => {
    expect(sanitizePhoneNumber("০১৭")).toBe("");
  });
});

describe("toLocalNumber", () => {
  const cases: Array<[string, string]> = [
    ["8801781131905", "01781131905"],
    ["+8801781131905", "01781131905"],
    ["801781131905", "01781131905"],
    ["01781131905", "01781131905"],
    ["1781131905", "01781131905"],
    ["", ""],
  ];

  it.each(cases)("converts %s to %s", (input, expected) => {
    expect(toLocalNumber(input)).toBe(expected);
  });

  it("prefers the more specific country-code branch", () => {
    // "8801…" must win over "880…", and "801…" over "80…".
    expect(toLocalNumber("8801781131905")).toBe("01781131905");
    expect(toLocalNumber("801781131905")).toBe("01781131905");
  });
});

describe("toInputDigits", () => {
  it("leaves a partially typed number untouched", () => {
    for (const partial of ["", "0", "01", "017", "0178", "01781131905"]) {
      expect(toInputDigits(partial)).toBe(partial);
    }
  });

  it("does not rewrite short values that merely start with 8", () => {
    expect(toInputDigits("8")).toBe("8");
    expect(toInputDigits("880")).toBe("880");
  });

  it("removes a country code once the value is longer than a local number", () => {
    expect(toInputDigits("8801781131905")).toBe("01781131905");
    expect(toInputDigits("+8801781131905")).toBe("01781131905");
    expect(toInputDigits("801781131905")).toBe("01781131905");
    expect(toInputDigits("008801781131905")).toBe("01781131905");
  });

  it("clamps to 11 digits", () => {
    expect(toInputDigits("0178113190555555")).toBe("01781131905");
  });

  it("strips formatting characters", () => {
    expect(toInputDigits("017 8113-1905")).toBe("01781131905");
  });
});

describe("normalizePhoneNumber", () => {
  it("returns the canonical form for a complete number", () => {
    expect(normalizePhoneNumber("1781131905")).toBe("+8801781131905");
    expect(normalizePhoneNumber("+880 17 8113 1905")).toBe("+8801781131905");
  });

  it("returns undefined for incomplete or invalid numbers", () => {
    expect(normalizePhoneNumber("017")).toBeUndefined();
    expect(normalizePhoneNumber("")).toBeUndefined();
    expect(normalizePhoneNumber("01211111111")).toBeUndefined();
    expect(normalizePhoneNumber("017811319055")).toBeUndefined();
  });
});
