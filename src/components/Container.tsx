/** @jsxImportSource frog/jsx */

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Container({
  children,
  tw,
}: {
  children?: ReactNode;
  tw?: string;
}) {
  return (
    <div
      tw={twMerge(
        "flex h-full w-full flex-col bg-[#201E29] text-4xl font-normal text-white",
        tw,
      )}
      style={{ fontFamily: "Beatrice" }}
    >
      {children}
    </div>
  );
}
