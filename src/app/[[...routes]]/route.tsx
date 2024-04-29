/** @jsxImportSource frog/jsx */

import { About } from "@/screens/About";
import { Activity } from "@/screens/Activity";
import { Home } from "@/screens/Home";
import { Rewards } from "@/screens/Rewards";
import { Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { readFileSync } from "node:fs";
import path from "node:path";

const app = new Frog({
  assetsPath: "/",
  basePath: "/",
  browserLocation: "https://juicebox.money/v2/p/:id",
  imageAspectRatio: "1:1",
  imageOptions: {
    debug: process.env.FRAME_DEBUG_MODE === "true",
    width: 1080,
    height: 1080,
    fonts: [
      {
        name: "Agrandir",
        weight: 500,
        data: readFileSync(
          path.resolve(process.cwd(), "./fonts/PPAgrandir-Medium.ttf")
        ),
      },
      {
        name: "Beatrice",
        weight: 400,
        data: readFileSync(
          path.resolve(process.cwd(), "./fonts/Beatrice-Regular.ttf")
        ),
      },
    ],
  },
});

app.frame("/:id", (ctx) => {
  const id = Number(ctx.req.param("id"));

  return Home({ ctx, id });
});

app.frame("/:id/about", (ctx) => {
  const id = Number(ctx.req.param("id"));

  return About({ ctx, id });
});

app.frame("/:id/activity", (ctx) => {
  const id = Number(ctx.req.param("id"));

  return Activity({ ctx, id });
});

app.frame("/:id/rewards", (ctx) => {
  const id = Number(ctx.req.param("id"));

  return Rewards({ ctx, id });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
