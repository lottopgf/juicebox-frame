/** @jsxImportSource frog/jsx */

import { ViewOnJuicebox } from "@/components/ViewOnJuicebox";
import { twMerge } from "tailwind-merge";

export function Header({ page, tw }: { page?: string; tw?: string }) {
  return (
    <div
      tw={twMerge(
        `flex h-[100px] w-full items-center justify-between px-12`,
        tw,
      )}
      style={{ fontFamily: "Agrandir", gap: 16 }}
    >
      <span tw="flex-shrink-0 text-5xl leading-normal">{page}</span>
      <ViewOnJuicebox />
    </div>
  );
}
