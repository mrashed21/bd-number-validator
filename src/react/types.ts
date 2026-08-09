import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import type {
  Operator,
  PhoneValidationCode,
  PhoneValidationResult,
} from "../core/types";

/** Every part of {@link PhoneInputBd} that can be styled or class-named. */
export type PhoneInputBdSlot =
  | "container"
  | "label"
  | "inputWrapper"
  | "flag"
  | "prefix"
  | "input"
  | "error";

/** Live state handed to function-based styles. */
export interface PhoneInputBdState {
  /** `true` while the value is acceptable so far (see `validatePhoneNumber`). */
  isValid: boolean;
  /** `true` when an error message is currently being shown. */
  hasError: boolean;
  /** `true` while the inner `<input>` has focus. */
  isFocused: boolean;
  /** `true` when the input is disabled. */
  isDisabled: boolean;
  /** `true` when the input is read-only. */
  isReadOnly: boolean;
  /** `true` once the number is complete and valid. */
  isComplete: boolean;
}

/** A style object, or a function that derives one from the current state. */
export type PhoneInputBdStyleValue =
  | CSSProperties
  | ((state: PhoneInputBdState) => CSSProperties);

/** Per-slot inline style overrides. Merged on top of the built-in styles. */
export type PhoneInputBdStyles = Partial<
  Record<PhoneInputBdSlot, PhoneInputBdStyleValue>
>;

/** Per-slot `className` overrides. */
export type PhoneInputBdClassNames = Partial<
  Record<PhoneInputBdSlot, string>
>;

/** Details passed as the second argument of {@link PhoneInputBdProps.onChange}. */
export interface PhoneChangeDetails extends PhoneValidationResult {
  /** Digits currently held by the input — identical to the first argument. */
  raw: string;
  /** What the user sees, e.g. `"017 8113 1905"`. */
  formatted: string;
}

/** Options for {@link useBdPhone}. */
export interface UseBdPhoneOptions {
  /**
   * Controlled value. Any accepted shape works (`01781131905`, `+8801781131905`,
   * `017 8113-1905`); it is reduced to digits internally. Pass `undefined` to
   * let the hook manage its own state.
   */
  value?: string;
  /** Initial value for uncontrolled usage. Ignored when `value` is provided. */
  defaultValue?: string;
  /** Called with the new digits and the full validation details. */
  onChange?: (value: string, details: PhoneChangeDetails) => void;
}

/** Return value of {@link useBdPhone}. */
export interface UseBdPhoneReturn extends PhoneValidationResult {
  /** Digits currently entered, country code already removed. */
  raw: string;
  /** Display form of `raw`, e.g. `"017 8113 1905"`. */
  formatted: string;
  /** Canonical `+8801XXXXXXXXX`, or `undefined` until the number is complete. */
  normalized?: string;
  /** Canonical `01XXXXXXXXX`, or `undefined` until the number is complete. */
  local?: string;
  /** Detected operator, available from three digits onwards. */
  operator?: Operator;
  /** Human-readable error, or `undefined` when there is nothing to report. */
  error?: string;
  /** Machine-readable status. */
  code?: PhoneValidationCode;
  /** `true` while the value is acceptable so far. */
  isValid: boolean;
  /** `true` only when the number is complete and valid — safe to submit. */
  isComplete: boolean;
  /** Accepts a raw string (or an input event value) and updates the value. */
  onChange: (value: string) => void;
  /** Clears the value. */
  reset: () => void;
}

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  // Owned by this component…
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  // …and re-declared below with a richer type than the DOM attribute.
  | "prefix"
  | "style"
  | "className"
>;

/** Props for {@link PhoneInputBd}. */
export interface PhoneInputBdProps extends NativeInputProps {
  /**
   * Controlled value — the digits to display. Any accepted shape works.
   * Provide together with {@link PhoneInputBdProps.onChange}.
   */
  value?: string;
  /** Initial value for uncontrolled usage. Ignored when `value` is provided. */
  defaultValue?: string;
  /**
   * Fired on every edit.
   *
   * @param value - Digits only, e.g. `"01781131905"`. Feed this straight back
   *   into the `value` prop; it is never the formatted display string.
   * @param details - Validation result plus `raw` and `formatted`. Read
   *   `details.normalized` for the canonical `+8801XXXXXXXXX` form.
   */
  onChange?: (value: string, details: PhoneChangeDetails) => void;

  /** Label content. No label is rendered when omitted. */
  label?: ReactNode;
  /**
   * Error content. When set, it replaces the built-in validation message —
   * useful for surfacing errors from a form library. Pass `false`/`null` to
   * suppress the message for this render.
   */
  error?: ReactNode;
  /**
   * Whether the built-in validation message may be shown.
   * @defaultValue true
   */
  showError?: boolean;
  /**
   * Flag element rendered before the prefix. Pass `null` to hide it.
   * @defaultValue `<BdFlag />`
   */
  flag?: ReactNode;
  /**
   * Dialling prefix rendered before the input. Pass `null` to hide it.
   * @defaultValue "+880"
   */
  prefix?: ReactNode;

  /** `className` for the outermost element. */
  className?: string;
  /** Per-slot `className` overrides. */
  classNames?: PhoneInputBdClassNames;
  /** Per-slot inline style overrides, merged over the built-in styles. */
  styles?: PhoneInputBdStyles;
  /**
   * Drop every built-in style so only `styles`/`classNames` apply — handy with
   * Tailwind, CSS modules or a design system.
   * @defaultValue false
   */
  unstyled?: boolean;
}
