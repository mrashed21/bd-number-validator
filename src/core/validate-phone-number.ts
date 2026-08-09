import { toLocalNumber } from "./normalize-phone-number";
import { COUNTRY_CODE, detectOperator, LOCAL_NUMBER_LENGTH } from "./operators";
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

export function validatePhoneNumber(
  input: string,
  options: ValidatePhoneNumberOptions = {},
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

export function isValidPhoneNumber(input: string): boolean {
  return validatePhoneNumber(input).normalized !== undefined;
}
