type Operator = "Grameenphone" | "Banglalink" | "Robi" | "Airtel" | "Teletalk" | "Unknown";
interface PhoneValidationResult {
    isValid: boolean;
    normalized?: string;
    operator?: Operator;
    error?: string;
}
declare function validatePhoneNumber(input: string): PhoneValidationResult;

export { Operator, PhoneValidationResult, validatePhoneNumber };
