/** @jsxImportSource frog/jsx */

import { getProject } from "@/api/project";
import { BackButton } from "@/components/BackButton";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { Button, FrameContext } from "frog";
import sanitize from "sanitize-html";

export async function About({ ctx, id }: { ctx: FrameContext; id: number }) {
  const data = await getProject({ projectId: id });

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
      <BackButton key="back" id={id} />,
      <Button key="activity" action={`/${id}/activity`}>
        Activity
      </Button>,
      <Button key="rewards" action={`/${id}/rewards`}>
        Rewards
      </Button>,
    ],
  });
}
