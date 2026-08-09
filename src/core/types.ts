export type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

export type KnownOperator = Exclude<Operator, "Unknown">;

export type PhoneValidationCode =
  | "EMPTY"
  | "INCOMPLETE"
  | "INVALID_OPERATOR"
  | "INVALID_LENGTH";

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  local?: string;
  operator?: Operator;
  error?: string;
  code?: PhoneValidationCode;
}

export interface ValidatePhoneNumberOptions {
  strict?: boolean;
  allowEmpty?: boolean;
}
