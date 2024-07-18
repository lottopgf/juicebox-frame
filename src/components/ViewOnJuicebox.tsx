/** @jsxImportSource frog/jsx */

import { IconArrow } from "@/graphics/IconArrow";
import { LogoJuicebox } from "@/graphics/LogoJuicebox";

export function ViewOnJuicebox() {
  return (
    <div tw="flex items-center" style={{ fontFamily: "Agrandir" }}>
      <IconArrow tw="h-10 w-10" />
      <span tw="ml-2 mr-2 text-4xl">view on</span>
      <LogoJuicebox tw="h-[38px] w-[190px]" />
    </div>
  );
}
