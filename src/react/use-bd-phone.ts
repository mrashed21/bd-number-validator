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

export function useBdPhone(options: UseBdPhoneOptions = {}): UseBdPhoneReturn {
  const { value: controlledValue, defaultValue = "", onChange } = options;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    toInputDigits(defaultValue),
  );

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const raw = isControlled ? toInputDigits(controlledValue) : uncontrolledValue;

  const commit = useCallback(
    (next: string) => {
      const digits = toInputDigits(next);
      if (!isControlled) setUncontrolledValue(digits);
      onChangeRef.current?.(digits, buildDetails(digits));
    },
    [isControlled],
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
