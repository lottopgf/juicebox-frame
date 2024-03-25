import { getProject } from "@/api/project";
import { Container } from "@/components/Container";
import { State } from "@/index";
import { formatEther } from "@/lib/format";
import { cidFromURL, ipfsURL } from "@/lib/ipfs";
import { Button, FrameContext } from "frog";

export async function Home({
  ctx,
  id,
}: {
  ctx: FrameContext<{ State: State }>;
  id: number;
}) {
  const data = await getProject(id);

  const logoURL = ipfsURL(cidFromURL(data.metadata.logoUri));

  return ctx.res({
    image: (
      <Container>
        <div tw="flex-shrink-0 flex flex-col items-end bg-[#201E29] w-full px-8 py-6">
          <span>view on Juicebox</span>
          <span tw="text-6xl">xxd xxh xxm left</span>
        </div>
        <div tw="flex-1 flex flex-col px-8 bg-[#16141D]" style={{ gap: 32 }}>
          <img
            src={logoURL}
            tw="w-[300px] h-[300px] -mt-[118px] border-[#16141D] border-[10px] rounded-3xl"
          />
          <span tw="text-7xl" style={{ fontFamily: "Agrandir" }}>
            {data.metadata.name}
          </span>
          <span>Payments: {data.paymentsCount}</span>
          <span>Total Raised: {formatEther(data.volume)} ETH</span>
          <span>Last 7 Days: ???%</span>
          <span>{data.metadata.projectTagline}</span>
        </div>
        <div tw="flex-shrink-0 flex justify-center bg-[#201E29] w-full px-8 py-6">
          <span>Receive xxx $TOKEN per ETH paid</span>
        </div>
      </Container>
    ),
    intents: [
      <Button action={`/${id}/activity`}>Activity</Button>,
      <Button action={`/${id}/about`}>About</Button>,
      <Button action={`/${id}/rewards`}>Rewards</Button>,
    ],
  });
}
