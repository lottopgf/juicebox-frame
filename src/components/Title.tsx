/** @jsxImportSource frog/jsx */

import type { ReactNode } from "hono/jsx";
import { twMerge } from "tailwind-merge";

export function Title({ children, tw }: { children?: ReactNode; tw?: string }) {
  return (
    <div
      tw={twMerge(`mb-9 flex-shrink-0 text-7xl font-medium leading-none`, tw)}
      style={{ fontFamily: "Agrandir", display: "block", lineClamp: 2 }}
    >
      {children}
    </div>
  );
}
