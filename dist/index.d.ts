import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface BDPhoneInputProps {
    value?: string;
    onValueChange?: (v?: string) => void;
    showError?: boolean;
    customError?: (err: string) => React.ReactNode;
    label?: string;
    className?: string;
    wrapperClass?: string;
    inputBoxClass?: string;
    inputClass?: string;
    labelClass?: string;
}
declare function BDPhoneInput({ value, onValueChange, showError, customError, label, className, wrapperClass, inputBoxClass, inputClass, labelClass, }: BDPhoneInputProps): react_jsx_runtime.JSX.Element;

type Operator = "Grameenphone" | "Banglalink" | "Robi" | "Airtel" | "Teletalk" | "Unknown";
interface PhoneValidationResult {
    isValid: boolean;
    normalized?: string;
    operator?: Operator;
    error?: string;
}
declare function validatePhoneNumber(input: string): PhoneValidationResult;

declare function useBDPhone(initial?: string): {
    raw: string;
    normalized: string | undefined;
    operator: Operator | undefined;
    error: string | undefined;
    isValid: boolean;
    onChange: (v: string) => void;
};

export { BDPhoneInput, Operator, PhoneValidationResult, useBDPhone, validatePhoneNumber };
