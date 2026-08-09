import type { CSSProperties } from "react";
import type {
  PhoneInputBdSlot,
  PhoneInputBdState,
  PhoneInputBdStyleValue,
} from "./types";

export const CSS_VARIABLES = [
  "--phone-input-bd-gap",
  "--phone-input-bd-inner-gap",
  "--phone-input-bd-padding",
  "--phone-input-bd-height",
  "--phone-input-bd-radius",
  "--phone-input-bd-bg",
  "--phone-input-bd-color",
  "--phone-input-bd-border",
  "--phone-input-bd-border-focus",
  "--phone-input-bd-border-error",
  "--phone-input-bd-ring",
  "--phone-input-bd-ring-error",
  "--phone-input-bd-shadow",
  "--phone-input-bd-label-color",
  "--phone-input-bd-prefix-color",
  "--phone-input-bd-error-color",
  "--phone-input-bd-font-size",
  "--phone-input-bd-line-height",
] as const;

/**
 * The defaults below mirror shadcn/ui's `Input`, `Label` and `FormMessage`:
 * `h-9` (36px), `rounded-md` (8px), `px-3`, `text-sm`, `border-input`,
 * `shadow-xs`, a 3px `ring-ring/50` on focus and `ring-destructive/20` when
 * invalid. Colours are the neutral base theme resolved from oklch to sRGB --
 * `--input` #e5e5e5, `--ring` #a1a1a1, `--destructive` #e7000b,
 * `--foreground` #0a0a0a, `--muted-foreground` #737373.
 *
 * Every value stays behind a CSS variable, so pointing the component at your
 * own shadcn theme is a matter of mapping the tokens:
 *
 *   --phone-input-bd-border: var(--input);
 *   --phone-input-bd-ring: color-mix(in oklab, var(--ring) 50%, transparent);
 */

/**
 * Shared by the prefix and the input so both render an identical line box.
 * Unitless, and always set explicitly: a page-level `line-height` must never
 * reach the row, or the control height drifts with the host stylesheet.
 * 14px x 1.4285714 = 20px -- Tailwind's `text-sm` -- which with the default
 * padding and border lands the control on exactly 36px, shadcn's `h-9`.
 */
const FIELD_FONT_SIZE = "var(--phone-input-bd-font-size, 14px)";
const FIELD_LINE_HEIGHT = "var(--phone-input-bd-line-height, 1.4285714)";

/** shadcn `shadow-xs`, kept underneath the focus ring the way Tailwind stacks them. */
const BASE_SHADOW = "var(--phone-input-bd-shadow, 0 1px 2px 0 rgb(0 0 0 / 0.05))";

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
  if (state.hasError) return "var(--phone-input-bd-border-error, #e7000b)";
  if (state.isFocused) return "var(--phone-input-bd-border-focus, #a1a1a1)";
  return "var(--phone-input-bd-border, #e5e5e5)";
}

/**
 * An invalid field keeps its ring whether or not it is focused, and the
 * destructive ring outranks the focus ring -- both are shadcn's behaviour.
 */
function boxShadow(state: PhoneInputBdState): string {
  if (state.hasError)
    return `0 0 0 3px var(--phone-input-bd-ring-error, rgba(231, 0, 11, 0.2)), ${BASE_SHADOW}`;
  if (state.isFocused)
    return `0 0 0 3px var(--phone-input-bd-ring, rgba(161, 161, 161, 0.5)), ${BASE_SHADOW}`;
  return BASE_SHADOW;
}

export function getDefaultStyles(
  state: PhoneInputBdState,
  unstyled = false,
): Record<PhoneInputBdSlot, CSSProperties> {
  if (unstyled) return EMPTY_STYLES;

  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--phone-input-bd-gap, 8px)",
      width: "100%",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1,
      color: state.hasError
        ? "var(--phone-input-bd-error-color, #e7000b)"
        : "var(--phone-input-bd-label-color, #0a0a0a)",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "var(--phone-input-bd-inner-gap, 8px)",
      boxSizing: "border-box",
      width: "100%",
      minHeight: "var(--phone-input-bd-height, 36px)",
      padding: "var(--phone-input-bd-padding, 7px 12px)",
      background: "var(--phone-input-bd-bg, transparent)",
      border: `1px solid ${borderColor(state)}`,
      borderRadius: "var(--phone-input-bd-radius, 8px)",
      boxShadow: boxShadow(state),
      transition:
        "border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: state.isDisabled ? 0.5 : 1,
      cursor: state.isDisabled ? "not-allowed" : undefined,
    },
    flag: {
      display: "block",
      flexShrink: 0,
      borderRadius: "2px",
    },
    prefix: {
      flexShrink: 0,
      fontWeight: 400,
      fontSize: FIELD_FONT_SIZE,
      lineHeight: FIELD_LINE_HEIGHT,
      fontFamily: "inherit",
      whiteSpace: "nowrap",
      userSelect: "none",
      color: "var(--phone-input-bd-prefix-color, #737373)",
    },
    input: {
      flex: 1,
      minWidth: 0,
      width: "100%",
      padding: 0,
      margin: 0,
      border: "none",
      outline: "none",
      appearance: "none",
      background: "transparent",
      fontSize: FIELD_FONT_SIZE,
      fontWeight: 400,
      lineHeight: FIELD_LINE_HEIGHT,
      textAlign: "left",
      fontFamily: "inherit",
      color: "var(--phone-input-bd-color, #0a0a0a)",
      cursor: state.isDisabled ? "not-allowed" : undefined,
    },
    error: {
      display: "block",
      fontSize: "14px",
      lineHeight: FIELD_LINE_HEIGHT,
      color: "var(--phone-input-bd-error-color, #e7000b)",
    },
  };
}

export function resolveStyle(
  value: PhoneInputBdStyleValue | undefined,
  state: PhoneInputBdState,
): CSSProperties | undefined {
  return typeof value === "function" ? value(state) : value;
}
