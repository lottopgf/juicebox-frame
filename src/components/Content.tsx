/** @jsxImportSource frog/jsx */

import type { CSSProperties } from "hono/jsx";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Content({
  children,
  tw,
  style,
}: {
  children?: ReactNode;
  tw?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      tw={twMerge(
        "flex flex-1 flex-col px-12 py-9 text-[44px] leading-tight text-black",
        tw,
      )}
    >
      {children}
    </div>
  );
}
