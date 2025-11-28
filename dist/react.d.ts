import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { Operator } from './index.js';

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

declare function useBDPhone(initial?: string): {
    raw: string;
    normalized: string | undefined;
    operator: Operator | undefined;
    error: string | undefined;
    isValid: boolean;
    onChange: (v: string) => void;
};

export { BDPhoneInput, useBDPhone };
