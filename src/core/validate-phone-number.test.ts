import { describe, expect, it } from "vitest";
import {
  isValidPhoneNumber,
  validatePhoneNumber,
} from "./validate-phone-number";

describe("validatePhoneNumber — accepted input shapes", () => {
  const shapes = [
    "01781131905",
    "1781131905",
    "8801781131905",
    "+8801781131905",
    "017 8113-1905",
    "  017-8113 1905  ",
    "(017) 8113 1905",
    "801781131905",
  ];

  it.each(shapes)("normalizes %s", (input) => {
    const result = validatePhoneNumber(input);
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe("+8801781131905");
    expect(result.local).toBe("01781131905");
    expect(result.operator).toBe("Grameenphone");
    expect(result.error).toBeUndefined();
  });

  it("produces a normalized value matching E.164 for every operator", () => {
    for (const number of [
      "01711111111",
      "01311111111",
      "01911111111",
      "01411111111",
      "01811111111",
      "01611111111",
      "01511111111",
    ]) {
      expect(validatePhoneNumber(number).normalized).toMatch(/^\+8801\d{9}$/);
    }
  });

  it("is idempotent — re-validating a normalized value gives the same result", () => {
    const first = validatePhoneNumber("1781131905");
    const second = validatePhoneNumber(first.normalized as string);
    expect(second).toEqual(first);
  });
});

describe("validatePhoneNumber — operator detection", () => {
  const cases: Array<[string, string]> = [
    ["01711111111", "Grameenphone"],
    ["01311111111", "Grameenphone"],
    ["01911111111", "Banglalink"],
    ["01411111111", "Banglalink"],
    ["01811111111", "Robi"],
    ["01611111111", "Airtel"],
    ["01511111111", "Teletalk"],
  ];

  it.each(cases)("detects %s as %s", (number, operator) => {
    expect(validatePhoneNumber(number).operator).toBe(operator);
  });

  it("reports the operator as soon as three digits are known", () => {
    const result = validatePhoneNumber("017");
    expect(result.isValid).toBe(true);
    expect(result.operator).toBe("Grameenphone");
    expect(result.normalized).toBeUndefined();
  });

  it("rejects an unknown prefix", () => {
    const result = validatePhoneNumber("01211111111");
    expect(result.isValid).toBe(false);
    expect(result.operator).toBe("Unknown");
    expect(result.code).toBe("INVALID_OPERATOR");
    expect(result.error).toBe("Invalid operator");
  });

  it("rejects a landline number", () => {
    expect(validatePhoneNumber("0229123456").code).toBe("INVALID_OPERATOR");
  });
});

describe("validatePhoneNumber — progressive length rules", () => {
  it("treats empty input as valid but incomplete", () => {
    expect(validatePhoneNumber("")).toEqual({ isValid: true, code: "EMPTY" });
  });

  it("treats whitespace-only input as empty", () => {
    expect(validatePhoneNumber("   ").isValid).toBe(true);
    expect(validatePhoneNumber("   ").normalized).toBeUndefined();
  });

  it("treats letters-only input as empty", () => {
    expect(validatePhoneNumber("abc-def").code).toBe("EMPTY");
  });

  it.each([1, 2, 3])("accepts %i digit(s) while typing", (length) => {
    const result = validatePhoneNumber("01781131905".slice(0, length));
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it.each([4, 5, 7, 10])("rejects an incomplete %i-digit number", (length) => {
    const result = validatePhoneNumber("01781131905".slice(0, length));
    expect(result.isValid).toBe(false);
    expect(result.code).toBe("INCOMPLETE");
    expect(result.error).toBe("Invalid number");
  });

  it("accepts exactly 11 digits", () => {
    expect(validatePhoneNumber("01781131905").isValid).toBe(true);
  });

  it("rejects more than 11 digits", () => {
    const result = validatePhoneNumber("017811319055");
    expect(result.isValid).toBe(false);
    expect(result.code).toBe("INVALID_LENGTH");
    expect(result.error).toBe("Invalid number");
  });
});

describe("validatePhoneNumber — strict mode", () => {
  it("rejects empty input", () => {
    const result = validatePhoneNumber("", { strict: true });
    expect(result.isValid).toBe(false);
    expect(result.code).toBe("EMPTY");
    expect(result.error).toBe("Phone number is required");
  });

  it("accepts empty input when allowEmpty is set", () => {
    expect(validatePhoneNumber("", { strict: true, allowEmpty: true })).toEqual(
      {
        isValid: true,
        code: "EMPTY",
      },
    );
  });

  it("rejects partially typed input that non-strict mode accepts", () => {
    expect(validatePhoneNumber("017").isValid).toBe(true);
    expect(validatePhoneNumber("017", { strict: true }).isValid).toBe(false);
    expect(validatePhoneNumber("017", { strict: true }).code).toBe(
      "INCOMPLETE",
    );
  });

  it("still accepts a complete number", () => {
    expect(validatePhoneNumber("01781131905", { strict: true }).isValid).toBe(
      true,
    );
  });
});

describe("validatePhoneNumber — v1 result contract", () => {
  it("keeps the documented shape for a valid number", () => {
    const result = validatePhoneNumber("01781131905");
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe("+8801781131905");
    expect(result.operator).toBe("Grameenphone");
  });

  it("keeps the documented error strings", () => {
    expect(validatePhoneNumber("01211111111").error).toBe("Invalid operator");
    expect(validatePhoneNumber("0178113").error).toBe("Invalid number");
  });
});

describe("isValidPhoneNumber", () => {
  it("is true only for a complete valid number", () => {
    expect(isValidPhoneNumber("01781131905")).toBe(true);
    expect(isValidPhoneNumber("+8801781131905")).toBe(true);
    expect(isValidPhoneNumber("017")).toBe(false);
    expect(isValidPhoneNumber("")).toBe(false);
    expect(isValidPhoneNumber("01211111111")).toBe(false);
  });
});
