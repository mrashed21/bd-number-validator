import { COUNTRY_CODE, detectOperator, LOCAL_NUMBER_LENGTH } from "./operators";
import { toLocalNumber } from "./normalize-phone-number";
import type {
  Operator,
  PhoneValidationResult,
  ValidatePhoneNumberOptions,
} from "./types";

const ERROR_MESSAGES = {
  EMPTY: "Phone number is required",
  INCOMPLETE: "Invalid number",
  INVALID_OPERATOR: "Invalid operator",
  INVALID_LENGTH: "Invalid number",
} as const;

/**
 * Validate, normalize and identify a Bangladeshi mobile number.
 *
 * Accepts every common shape — `01781131905`, `1781131905`, `8801781131905`,
 * `+8801781131905`, `017 8113-1905` — and produces one canonical output.
 *
 * By default the check is **progressive**: an empty or partially typed number
 * is reported as `isValid: true` so a live form does not flash an error while
 * the user is still typing. `normalized` is only present for a complete number,
 * so treat that field — not `isValid` alone — as proof of a submittable value.
 * Pass `{ strict: true }` to reject anything incomplete outright.
 *
 * This function is pure and free of any framework or DOM dependency, so the
 * same call works in the browser, in Node, and at the edge.
 *
 * @example
 * validatePhoneNumber("01781131905");
 * // { isValid: true, normalized: "+8801781131905", local: "01781131905", operator: "Grameenphone" }
 *
 * @example
 * validatePhoneNumber("", { strict: true });
 * // { isValid: false, code: "EMPTY", error: "Phone number is required" }
 */
export function validatePhoneNumber(
  input: string,
  options: ValidatePhoneNumberOptions = {}
): PhoneValidationResult {
  const { strict = false, allowEmpty = false } = options;

  const local = toLocalNumber(input ?? "");

  if (local.length === 0) {
    if (strict && !allowEmpty) {
      return { isValid: false, code: "EMPTY", error: ERROR_MESSAGES.EMPTY };
    }
    return { isValid: true, code: "EMPTY" };
  }

  let operator: Operator | undefined;

  if (local.length >= 3) {
    operator = detectOperator(local);

    if (operator === "Unknown") {
      return {
        isValid: false,
        operator,
        code: "INVALID_OPERATOR",
        error: ERROR_MESSAGES.INVALID_OPERATOR,
      };
    }
  }

  if (local.length === LOCAL_NUMBER_LENGTH) {
    return {
      isValid: true,
      normalized: COUNTRY_CODE + local.slice(1),
      local,
      operator,
    };
  }

  if (local.length > LOCAL_NUMBER_LENGTH) {
    return {
      isValid: false,
      operator,
      code: "INVALID_LENGTH",
      error: ERROR_MESSAGES.INVALID_LENGTH,
    };
  }

  // Fewer than 11 digits. Up to three digits is "still typing"; beyond that the
  // number is long enough that an incomplete value is worth flagging.
  const incomplete: PhoneValidationResult = {
    isValid: false,
    operator,
    code: "INCOMPLETE",
    error: ERROR_MESSAGES.INCOMPLETE,
  };

  if (strict) return incomplete;
  if (local.length <= 3) return { isValid: true, operator, code: "INCOMPLETE" };
  return incomplete;
}

/**
 * Convenience predicate: `true` only for a complete, valid Bangladeshi mobile
 * number. Equivalent to checking that `validatePhoneNumber(input).normalized`
 * is set.
 */
export function isValidPhoneNumber(input: string): boolean {
  return validatePhoneNumber(input).normalized !== undefined;
}
