import { useCallback, useRef, useState } from "react";
import { formatBdPhoneUi } from "../core/format-bd-phone-ui";
import { toInputDigits } from "../core/normalize-phone-number";
import { validatePhoneNumber } from "../core/validate-phone-number";
import type {
  PhoneChangeDetails,
  UseBdPhoneOptions,
  UseBdPhoneReturn,
} from "./types";

function buildDetails(raw: string): PhoneChangeDetails {
  return {
    ...validatePhoneNumber(raw),
    raw,
    formatted: formatBdPhoneUi(raw),
  };
}

/**
 * Headless state + validation for a Bangladeshi phone field.
 *
 * Works controlled (pass `value`) or uncontrolled (pass `defaultValue`, or
 * nothing at all). Everything needed to render a field is returned, so you can
 * build any UI you like without touching {@link PhoneInputBd}.
 *
 * @example Uncontrolled
 * const phone = useBdPhone();
 * <input value={phone.formatted} onChange={(e) => phone.onChange(e.target.value)} />
 *
 * @example Controlled
 * const [value, setValue] = useState("");
 * const phone = useBdPhone({ value, onChange: setValue });
 */
export function useBdPhone(
  options: UseBdPhoneOptions = {}
): UseBdPhoneReturn {
  const { value: controlledValue, defaultValue = "", onChange } = options;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    toInputDigits(defaultValue)
  );

  // Keep the latest callback in a ref so `handleChange` stays referentially
  // stable even when the consumer passes an inline arrow function.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const raw = isControlled ? toInputDigits(controlledValue) : uncontrolledValue;

  const commit = useCallback(
    (next: string) => {
      const digits = toInputDigits(next);
      if (!isControlled) setUncontrolledValue(digits);
      onChangeRef.current?.(digits, buildDetails(digits));
    },
    [isControlled]
  );

  const reset = useCallback(() => commit(""), [commit]);

  const details = buildDetails(raw);

  return {
    ...details,
    isComplete: details.normalized !== undefined,
    onChange: commit,
    reset,
  };
}
