export {
  COUNTRY_CODE,
  detectOperator,
  KNOWN_PREFIXES,
  LOCAL_NUMBER_LENGTH,
  OPERATOR_PREFIXES,
} from "./operators";

export {
  normalizePhoneNumber,
  sanitizePhoneNumber,
  toInputDigits,
  toLocalNumber,
} from "./normalize-phone-number";

export {
  isValidPhoneNumber,
  validatePhoneNumber,
} from "./validate-phone-number";

export { formatBdPhoneUi } from "./format-bd-phone-ui";

export type {
  KnownOperator,
  Operator,
  PhoneValidationCode,
  PhoneValidationResult,
  ValidatePhoneNumberOptions,
} from "./types";
