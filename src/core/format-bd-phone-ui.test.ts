import { describe, expect, it } from "vitest";
import { formatBdPhoneUi } from "./format-bd-phone-ui";
import { sanitizePhoneNumber } from "./normalize-phone-number";

describe("formatBdPhoneUi", () => {
  const cases: Array<[string, string]> = [
    ["", ""],
    ["0", "0"],
    ["01", "01"],
    ["017", "017"],
    ["0178", "017 8"],
    ["01781", "017 81"],
    ["017811", "017 811"],
    ["0178113", "017 8113"],
    ["01781131", "017 8113 1"],
    ["017811319", "017 8113 19"],
    ["0178113190", "017 8113 190"],
    ["01781131905", "017 8113 1905"],
  ];

  it.each(cases)("formats %s as %s", (input, expected) => {
    expect(formatBdPhoneUi(input)).toBe(expected);
  });

  it("ignores characters that are not digits", () => {
    expect(formatBdPhoneUi("017-8113 1905")).toBe("017 8113 1905");
  });

  it("round-trips back to the original digits", () => {
    for (const [input] of cases) {
      expect(sanitizePhoneNumber(formatBdPhoneUi(input))).toBe(input);
    }
  });
});
