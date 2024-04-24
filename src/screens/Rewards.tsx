import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { State } from "@/index";
import { Button, FrameContext } from "frog";

export async function Rewards({
  ctx,
  id,
}: {
  ctx: FrameContext<{ State: State }>;
  id: number;
}) {
  const data = await getProject({ projectId: id });

  return ctx.res({
    image: (
      <Container>
        <Header project={data.metadata.name} page="Rewards" />
        <div tw="flex-1 px-8 py-6 bg-[#16141D] text-4xl leading-normal">
          Reward information here 🃏
        </div>
      </Container>
    ),
    intents: [
      <BackButton id={id} />,
      <Button action={`/${id}/about`}>About</Button>,
      <Button action={`/${id}/activity`}>Activity</Button>,
    ],
  });
}
