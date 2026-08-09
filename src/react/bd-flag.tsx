import type { SVGProps } from "react";

export interface BdFlagProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  title?: string;
}

export function BdFlag({
  title,
  width = 25,
  height = 15,
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
