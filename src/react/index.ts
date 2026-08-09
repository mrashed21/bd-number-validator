/**
 * `bd-number-validator/react` — React bindings.
 *
 * No stylesheet import is required: {@link PhoneInputBd} ships its styles
 * inline and every slot can be overridden with `styles`, `classNames` or CSS
 * custom properties.
 *
 * The whole framework-independent core is re-exported here as well, so a React
 * app only ever needs this one import path.
 */
export { PhoneInputBd } from "./phone-input-bd";
export { BdFlag } from "./bd-flag";
export { useBdPhone } from "./use-bd-phone";
export { CSS_VARIABLES, getDefaultStyles, resolveStyle } from "./default-styles";

export type { BdFlagProps } from "./bd-flag";
export type {
  PhoneChangeDetails,
  PhoneInputBdClassNames,
  PhoneInputBdProps,
  PhoneInputBdSlot,
  PhoneInputBdState,
  PhoneInputBdStyles,
  PhoneInputBdStyleValue,
  UseBdPhoneOptions,
  UseBdPhoneReturn,
} from "./types";

export * from "../core";
