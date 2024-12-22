import type { CSSProperties, ReactNode } from "react";
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
        "flex flex-1 flex-col px-12 py-9 text-4xl leading-tight text-black",
        tw,
      )}
    >
      {children}
    </div>
  );
}
