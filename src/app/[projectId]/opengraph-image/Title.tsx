import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Title({ children, tw }: { children?: ReactNode; tw?: string }) {
  return (
    <div
      tw={twMerge(`flex-shrink-0 text-6xl font-medium leading-none`, tw)}
      style={{ fontFamily: "Agrandir", display: "block", lineClamp: 2 }}
    >
      {children}
    </div>
  );
}
