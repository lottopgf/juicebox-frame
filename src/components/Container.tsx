import type { Child } from "hono/jsx";

export function Container({ children }: { children?: Child }) {
  return (
    <div
      tw="w-full h-full flex flex-col text-4xl text-white bg-[#201E29]"
      style={{ fontFamily: "Beatrice" }}
    >
      {children}
    </div>
  );
}
