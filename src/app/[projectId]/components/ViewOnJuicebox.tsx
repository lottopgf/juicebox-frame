import { IconArrow } from "@/app/[projectId]/graphics/IconArrow";
import { LogoJuicebox } from "@/app/[projectId]/graphics/LogoJuicebox";

export function ViewOnJuicebox() {
  return (
    <div className="flex items-center">
      <IconArrow className="h-4 w-4" />
      <span className="ml-1 mr-1">view on</span>
      <LogoJuicebox className="h-4" />
    </div>
  );
}
