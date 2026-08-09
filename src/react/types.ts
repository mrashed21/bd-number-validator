import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import type {
  Operator,
  PhoneValidationCode,
  PhoneValidationResult,
} from "../core/types";

export type PhoneInputBdSlot =
  | "container"
  | "label"
  | "inputWrapper"
  | "flag"
  | "prefix"
  | "input"
  | "error";

export interface PhoneInputBdState {
  isValid: boolean;
  hasError: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isComplete: boolean;
}

export type PhoneInputBdStyleValue =
  | CSSProperties
  | ((state: PhoneInputBdState) => CSSProperties);

export type PhoneInputBdStyles = Partial<
  Record<PhoneInputBdSlot, PhoneInputBdStyleValue>
>;

export type PhoneInputBdClassNames = Partial<Record<PhoneInputBdSlot, string>>;

export interface PhoneChangeDetails extends PhoneValidationResult {
  raw: string;
  formatted: string;
}

export interface UseBdPhoneOptions {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, details: PhoneChangeDetails) => void;
}

export interface UseBdPhoneReturn extends PhoneValidationResult {
  raw: string;
  formatted: string;
  normalized?: string;
  local?: string;
  operator?: Operator;
  error?: string;
  code?: PhoneValidationCode;
  isValid: boolean;
  isComplete: boolean;
  onChange: (value: string) => void;
  reset: () => void;
}

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  | "prefix"
  | "style"
  | "className"
>;

export interface PhoneInputBdProps extends NativeInputProps {
  value?: string;
  defaultValue?: string;

  onChange?: (value: string, details: PhoneChangeDetails) => void;

  label?: ReactNode;

  error?: ReactNode;

  showError?: boolean;

  flag?: ReactNode;

  prefix?: ReactNode;

  className?: string;
  classNames?: PhoneInputBdClassNames;
  styles?: PhoneInputBdStyles;

  unstyled?: boolean;
}
