import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { formatBdPhoneUi } from "../core/format-bd-phone-ui";
import { toInputDigits } from "../core/normalize-phone-number";
import { BdFlag } from "./bd-flag";
import { getDefaultStyles, resolveStyle } from "./default-styles";
import type { PhoneInputBdProps, PhoneInputBdState } from "./types";
import { useBdPhone } from "./use-bd-phone";

/** Count digits appearing before `caret` in `text`. */
function countDigitsBefore(text: string, caret: number): number {
  let digits = 0;
  for (let i = 0; i < caret && i < text.length; i++) {
    if (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) digits++;
  }
  return digits;
}

/** Index in `formatted` that sits immediately after its `count`-th digit. */
function caretAfterDigit(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted.charCodeAt(i) >= 48 && formatted.charCodeAt(i) <= 57) {
      seen++;
      if (seen === count) return i + 1;
    }
  }
  return formatted.length;
}

export const PhoneInputBd = forwardRef<HTMLInputElement, PhoneInputBdProps>(
  function PhoneInputBd(
    {
      value,
      defaultValue,
      onChange,

      label,
      error,
      showError = true,
      flag,
      prefix = "+880",

      className,
      classNames = {},
      styles = {},
      unstyled = false,

      id,
      placeholder = "017 8113 1905",
      inputMode = "numeric",
      autoComplete = "tel",
      disabled = false,
      readOnly = false,
      required = false,
      onFocus,
      onBlur,
      "aria-describedby": ariaDescribedBy,
      ...inputProps
    },
    forwardedRef,
  ) {
    const phone = useBdPhone({ value, defaultValue, onChange });

    const generatedId = useId();
    const innerRef = useRef<HTMLInputElement | null>(null);
    const pendingCaretRef = useRef<number | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const element = event.target;
      const nextText = element.value;
      const caret = element.selectionStart ?? nextText.length;
      const digitsBeforeCaret = countDigitsBefore(nextText, caret);

      const digits = toInputDigits(nextText);
      const formatted = formatBdPhoneUi(digits);
      const nextCaret = caretAfterDigit(formatted, digitsBeforeCaret);

      if (element.value !== formatted) element.value = formatted;
      pendingCaretRef.current = nextCaret;

      phone.onChange(digits);
    };

    useEffect(() => {
      const element = innerRef.current;
      const caret = pendingCaretRef.current;
      pendingCaretRef.current = null;

      if (!element || caret === null) return;
      if (typeof document !== "undefined" && document.activeElement !== element)
        return;

      element.setSelectionRange(caret, caret);
    });

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const builtInError = showError ? phone.error : undefined;
    const errorContent = error !== undefined ? error : builtInError;
    const hasError = Boolean(errorContent);

    const state: PhoneInputBdState = {
      isValid: phone.isValid,
      hasError,
      isFocused,
      isDisabled: disabled,
      isReadOnly: readOnly,
      isComplete: phone.isComplete,
    };

    const defaults = getDefaultStyles(state, unstyled);
    const styleFor = (slot: keyof typeof defaults) => ({
      ...defaults[slot],
      ...resolveStyle(styles[slot], state),
    });

    const inputId = id ?? `phone-input-bd-${generatedId}`;
    const errorId = `${inputId}-error`;
    const describedBy =
      [ariaDescribedBy, hasError ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div
        className={
          [className, classNames.container].filter(Boolean).join(" ") ||
          undefined
        }
        style={styleFor("container")}
      >
        {label !== undefined && label !== null && label !== false ? (
          <label
            htmlFor={inputId}
            className={classNames.label}
            style={styleFor("label")}
          >
            {label}
          </label>
        ) : null}

        <div
          className={classNames.inputWrapper}
          style={styleFor("inputWrapper")}
        >
          {flag === undefined ? (
            <BdFlag
              title="Bangladesh"
              className={classNames.flag}
              style={styleFor("flag")}
            />
          ) : (
            flag
          )}

          {prefix !== null && prefix !== undefined ? (
            <span className={classNames.prefix} style={styleFor("prefix")}>
              {prefix}
            </span>
          ) : null}

          <input
            {...inputProps}
            ref={setRefs}
            id={inputId}
            type="tel"
            value={phone.formatted}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            inputMode={inputMode}
            autoComplete={autoComplete}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={classNames.input}
            style={styleFor("input")}
          />
        </div>

        {hasError ? (
          <span
            id={errorId}
            role="alert"
            className={classNames.error}
            style={styleFor("error")}
          >
            {errorContent}
          </span>
        ) : null}
      </div>
    );
  },
);
