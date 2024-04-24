import type { Child } from "hono/jsx";
import { twMerge } from "tailwind-merge";

export function Container({ children, tw }: { children?: Child; tw?: string }) {
  return (
    <div
      tw={twMerge(
        "w-full h-full flex flex-col text-4xl text-white bg-[#201E29]",
        tw
      )}
      style={{ fontFamily: "Beatrice" }}
    >
      {children}
    </div>
  );
}
