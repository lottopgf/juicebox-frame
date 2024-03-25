import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { State } from "@/index";
import { Button, FrameContext } from "frog";
import sanitize from "sanitize-html";

export async function About({
  ctx,
  id,
}: {
  ctx: FrameContext<{ State: State }>;
  id: number;
}) {
  const data = await getProject(id);

  return ctx.res({
    image: (
      <Container>
        <Header project={data.metadata.name} page="About" />

        <div
          tw="flex-1 px-8 py-6 bg-[#16141D] text-4xl leading-normal"
          style={{ display: "block", lineClamp: 14 }}
        >
          {sanitize(data.metadata.description, {
            allowedTags: [],
            allowedAttributes: {},
          })}
        </div>
      </Container>
    ),
    intents: [
      <BackButton id={id} />,
      <Button action={`/${id}/activity`}>Activity</Button>,
      <Button action={`/${id}/rewards`}>Rewards</Button>,
    ],
  });
}
