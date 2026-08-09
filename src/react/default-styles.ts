import type { CSSProperties } from "react";
import type {
  PhoneInputBdSlot,
  PhoneInputBdState,
  PhoneInputBdStyleValue,
} from "./types";

/**
 * CSS custom properties honored by the built-in styles.
 *
 * Set any of them on an ancestor element to re-theme the input without writing
 * a single style override:
 *
 * ```css
 * .my-form { --phone-input-bd-border-focus: #16a34a; }
 * ```
 */
export const CSS_VARIABLES = [
  "--phone-input-bd-gap",
  "--phone-input-bd-padding",
  "--phone-input-bd-radius",
  "--phone-input-bd-bg",
  "--phone-input-bd-color",
  "--phone-input-bd-border",
  "--phone-input-bd-border-focus",
  "--phone-input-bd-border-error",
  "--phone-input-bd-label-color",
  "--phone-input-bd-prefix-color",
  "--phone-input-bd-error-color",
  "--phone-input-bd-font-size",
] as const;

const EMPTY_STYLES: Record<PhoneInputBdSlot, CSSProperties> = {
  container: {},
  label: {},
  inputWrapper: {},
  flag: {},
  prefix: {},
  input: {},
  error: {},
};

function borderColor(state: PhoneInputBdState): string {
  if (state.hasError) return "var(--phone-input-bd-border-error, #ef4444)";
  if (state.isFocused) return "var(--phone-input-bd-border-focus, #2563eb)";
  return "var(--phone-input-bd-border, #d1d5db)";
}

function focusRing(state: PhoneInputBdState): string | undefined {
  if (state.hasError)
    return "0 0 0 3px color-mix(in srgb, #ef4444 16%, transparent)";
  if (state.isFocused)
    return "0 0 0 3px color-mix(in srgb, #2563eb 16%, transparent)";
  return undefined;
}

/**
 * Built-in inline styles for every slot. They are applied directly on the
 * elements, which is why the component needs no stylesheet import.
 */
export function getDefaultStyles(
  state: PhoneInputBdState,
  unstyled = false,
): Record<PhoneInputBdSlot, CSSProperties> {
  if (unstyled) return EMPTY_STYLES;

  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--phone-input-bd-gap, 6px)",
      width: "100%",
    },
    label: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.4,
      color: "var(--phone-input-bd-label-color, #374151)",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxSizing: "border-box",
      width: "100%",
      minHeight: "40px",
      padding: "var(--phone-input-bd-padding, 10px 12px)",
      background: "var(--phone-input-bd-bg, #ffffff)",
      border: `1px solid ${borderColor(state)}`,
      borderRadius: "var(--phone-input-bd-radius, 6px)",
      boxShadow: focusRing(state),
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      opacity: state.isDisabled ? 0.6 : 1,
      cursor: state.isDisabled ? "not-allowed" : undefined,
    },
    flag: {
      display: "block",
      flexShrink: 0,
      borderRadius: "2px",
    },
    prefix: {
      fontWeight: 600,
      fontSize: "14px",
      whiteSpace: "nowrap",
      color: "var(--phone-input-bd-prefix-color, #4b5563)",
    },
    input: {
      flex: 1,
      minWidth: 0,
      padding: 0,
      margin: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "var(--phone-input-bd-font-size, 14px)",
      fontFamily: "inherit",
      color: "var(--phone-input-bd-color, #111827)",
      cursor: state.isDisabled ? "not-allowed" : undefined,
    },
    error: {
      marginTop: "2px",
      fontSize: "14px",
      lineHeight: 1.4,
      color: "var(--phone-input-bd-error-color, #dc2626)",
    },
  };
}

/** Resolve a style value that may be a plain object or a state-aware function. */
export function resolveStyle(
  value: PhoneInputBdStyleValue | undefined,
  state: PhoneInputBdState,
): CSSProperties | undefined {
  return typeof value === "function" ? value(state) : value;
}
