/**
 * Mobile network operators recognized by this package.
 *
 * `"Unknown"` is only produced when a prefix cannot be matched; in that case
 * {@link PhoneValidationResult.isValid} is `false`.
 */
export type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

/** Every operator that owns at least one prefix (i.e. everything but `"Unknown"`). */
export type KnownOperator = Exclude<Operator, "Unknown">;

/**
 * Machine-readable reason a number was rejected, or why it is not complete yet.
 *
 * - `EMPTY` — no digits at all.
 * - `INCOMPLETE` — a legal prefix, but fewer than 11 digits so far.
 * - `INVALID_OPERATOR` — the first three digits are not a known BD mobile prefix.
 * - `INVALID_LENGTH` — a legal prefix with the wrong number of digits.
 */
export type PhoneValidationCode =
  | "EMPTY"
  | "INCOMPLETE"
  | "INVALID_OPERATOR"
  | "INVALID_LENGTH";

/** Result of {@link validatePhoneNumber}. */
export interface PhoneValidationResult {
  /**
   * `true` when the input is acceptable *so far*.
   *
   * In the default (non-strict) mode an empty or partially typed number is
   * still `true`, so a form does not turn red while the user is typing.
   * A number is only **complete** when {@link PhoneValidationResult.normalized}
   * is present — check that field before submitting.
   */
  isValid: boolean;
  /** Canonical E.164 form, e.g. `"+8801781131905"`. Only set for a complete, valid number. */
  normalized?: string;
  /** Canonical local form, e.g. `"01781131905"`. Only set for a complete, valid number. */
  local?: string;
  /** Detected operator. Available as soon as three digits are known. */
  operator?: Operator;
  /** Human-readable error message. Only set when `isValid` is `false`. */
  error?: string;
  /** Machine-readable status. Set whenever the number is not complete and valid. */
  code?: PhoneValidationCode;
}

/** Options for {@link validatePhoneNumber}. */
export interface ValidatePhoneNumberOptions {
  /**
   * When `true`, empty and partially typed input is reported as invalid.
   * Use this for submit-time validation.
   *
   * @defaultValue false
   */
  strict?: boolean;
  /**
   * When `true` (and `strict` is on), an empty input is still accepted so an
   * optional field can be left blank.
   *
   * @defaultValue false
   */
  allowEmpty?: boolean;
}
