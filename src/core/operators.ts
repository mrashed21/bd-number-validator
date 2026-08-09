import type { KnownOperator, Operator } from "./types";

export const OPERATOR_PREFIXES: Readonly<
  Record<KnownOperator, readonly string[]>
> = {
  Grameenphone: ["017", "013"],
  Banglalink: ["019", "014"],
  Robi: ["018"],
  Airtel: ["016"],
  Teletalk: ["015"],
};

export const KNOWN_PREFIXES: readonly string[] =
  Object.values(OPERATOR_PREFIXES).flat();

export const LOCAL_NUMBER_LENGTH = 11;

export const COUNTRY_CODE = "+880";

export function detectOperator(localNumber: string): Operator {
  const prefix = localNumber.slice(0, 3);
  if (prefix.length < 3) return "Unknown";

  for (const operator of Object.keys(OPERATOR_PREFIXES) as KnownOperator[]) {
    if (OPERATOR_PREFIXES[operator].includes(prefix)) return operator;
  }

  return "Unknown";
}
