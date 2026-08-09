import type { KnownOperator, Operator } from "./types";

/**
 * Bangladeshi mobile prefixes, in local `0`-leading form, grouped by operator.
 *
 * Note: a ported number (MNP) keeps the prefix of the operator that originally
 * issued it, so detection reflects the *issuing* operator, not necessarily the
 * one currently serving the number.
 */
export const OPERATOR_PREFIXES: Readonly<
  Record<KnownOperator, readonly string[]>
> = {
  Grameenphone: ["017", "013"],
  Banglalink: ["019", "014"],
  Robi: ["018"],
  Airtel: ["016"],
  Teletalk: ["015"],
};

/** Flat list of every prefix this package accepts. */
export const KNOWN_PREFIXES: readonly string[] = Object.values(
  OPERATOR_PREFIXES
).flat();

/** Number of digits in a complete local Bangladeshi mobile number (`01XXXXXXXXX`). */
export const LOCAL_NUMBER_LENGTH = 11;

/** International dialing prefix used when normalizing. */
export const COUNTRY_CODE = "+880";

/**
 * Resolve the operator that owns a local number's prefix.
 *
 * @param localNumber - A local-form number such as `"01781131905"`. Only the
 *   first three characters are inspected.
 * @returns The matching operator, or `"Unknown"` when the prefix is not known.
 */
export function detectOperator(localNumber: string): Operator {
  const prefix = localNumber.slice(0, 3);
  if (prefix.length < 3) return "Unknown";

  for (const operator of Object.keys(OPERATOR_PREFIXES) as KnownOperator[]) {
    if (OPERATOR_PREFIXES[operator].includes(prefix)) return operator;
  }

  return "Unknown";
}
