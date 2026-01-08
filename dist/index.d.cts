export { BDPhoneInput, useBDPhone } from './react.cjs';
import 'react/jsx-runtime';
import 'react';

type Operator = "Grameenphone" | "Banglalink" | "Robi" | "Airtel" | "Teletalk" | "Unknown";
interface PhoneValidationResult {
    isValid: boolean;
    normalized?: string;
    operator?: Operator;
    error?: string;
}
declare function validatePhoneNumber(input: string): PhoneValidationResult;

export { validatePhoneNumber };
