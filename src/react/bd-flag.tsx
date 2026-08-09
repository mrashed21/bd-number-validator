import type { SVGProps } from "react";

/** Props for {@link BdFlag}. */
export interface BdFlagProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /**
   * Accessible name. When provided the flag is exposed as an image with this
   * name; when omitted it is hidden from assistive technology, which is the
   * right default for a decorative icon sitting next to a `+880` label.
   */
  title?: string;
}

/**
 * Inline SVG of the flag of Bangladesh, drawn to the official proportions
 * (10:6 field, disc radius 1/5 of the length, centered at 9/20 of the length).
 *
 * No network request, no CSS file, no external asset — it scales with
 * `width`/`height` or the surrounding font size.
 */
export function BdFlag({
  title,
  width = 30,
  height = 18,
  ...rest
}: BdFlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 18"
      width={width}
      height={height}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <rect width="30" height="18" fill="#006A4E" />
      <circle cx="13.5" cy="9" r="6" fill="#F42A41" />
    </svg>
  );
}
