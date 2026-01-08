import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface BDPhoneInputProps {
    value?: string;
    onValueChange?: (v?: string) => void;
    showError?: boolean;
    label?: string;
    showLabel?: boolean;
    labelClass?: string;
    renderLabel?: (label: string) => ReactNode;
    containerClass?: string;
    wrapperClass?: string;
    flagClass?: string;
    prefixClass?: string;
    inputClass?: string;
    errorClass?: string;
    renderFlag?: () => ReactNode;
    renderPrefix?: () => ReactNode;
    renderError?: (error: string) => ReactNode;
}
declare function BDPhoneInput({ value, onValueChange, showError, label, showLabel, labelClass, renderLabel, containerClass, wrapperClass, flagClass, prefixClass, inputClass, errorClass, renderFlag, renderPrefix, renderError, }: BDPhoneInputProps): react_jsx_runtime.JSX.Element;

declare function useBDPhone(initial?: string): {
    raw: string;
    normalized: string | undefined;
    operator: ("Grameenphone" | "Banglalink" | "Robi" | "Airtel" | "Teletalk" | "Unknown") | undefined;
    error: string | undefined;
    isValid: boolean;
    onChange: (v: string) => void;
};

export { BDPhoneInput, useBDPhone };
