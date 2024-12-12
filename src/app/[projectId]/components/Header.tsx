import type { getProject } from "@/api/project";
import { ViewOnJuicebox } from "@/app/[projectId]/components/ViewOnJuicebox";
import { IconJuicebox } from "@/app/[projectId]/graphics/IconJuicebox";
import { formatEther } from "@/lib/format";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { getTrendingPercentage } from "@/lib/juicebox";
import { cn } from "@/lib/utils";
import { COLOR_BG_SPLIT, COLOR_TEXT_SPLIT } from "@/styles/colors";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Project = Awaited<ReturnType<typeof getProject>>;

export function Header({
  projectId,
  project,
}: {
  projectId: number;
  project: Project;
}) {
  const logoURL = ipfsURL(cidFromURL(project.metadata.logoUri));

  const { paymentsCount, volume } = project;

  const trendingPercentage = getTrendingPercentage({
    totalVolume: project.volume,
    trendingVolume: project.trendingVolume,
  });

  return (
    <header className="mb-4 space-y-4">
      <Link
        href={`https://juicebox.money/v2/p/${projectId}?tabid=about`}
        className={cn(`block w-full`, COLOR_BG_SPLIT)}
      >
        <div className="mx-auto flex w-full max-w-prose items-center justify-between px-4 py-2 md:py-4">
          <span className="flex-shrink-0 text-xl leading-normal"></span>
          <ViewOnJuicebox />
        </div>
      </Link>
      <div className="mx-auto w-full max-w-prose space-y-4 px-4">
        <div className="flex items-start justify-between gap-2 md:gap-4">
          <div className="-mt-10 flex aspect-square w-[80px] flex-shrink-0 rounded-xl bg-black p-1 text-white md:-mt-14 md:w-[116px]">
            {logoURL ? (
              <Image
                src={logoURL}
                width={112}
                height={112}
                alt=""
                className="size-full rounded-lg"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <IconJuicebox className="m-auto size-4 opacity-10" />
            )}
          </div>
          <div className="flex justify-end gap-2 text-right md:gap-6">
            <div className="flex flex-col items-end">
              <span
                className={cn("text-xs uppercase md:text-sm", COLOR_TEXT_SPLIT)}
              >
                Payments
              </span>
              <span className="font-medium leading-snug md:text-2xl">
                {paymentsCount.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={cn("text-xs uppercase md:text-sm", COLOR_TEXT_SPLIT)}
              >
                Total Raised
              </span>
              <span className="font-medium leading-snug md:text-2xl">
                Ξ{formatEther(volume)}
              </span>
            </div>
            {trendingPercentage !== Infinity && (
              <div className="flex flex-col items-end">
                <span
                  className={cn(
                    "text-xs uppercase md:text-sm",
                    COLOR_TEXT_SPLIT,
                  )}
                >
                  Last 7 days
                </span>
                <span className="font-medium leading-snug md:text-2xl">
                  +{trendingPercentage.toLocaleString("en-US")}%
                </span>
              </div>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          {project.metadata.name}
        </h2>
      </div>
    </header>
  );
}