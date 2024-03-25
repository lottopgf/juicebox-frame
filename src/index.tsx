import { About } from "@/screens/About";
import { Activity } from "@/screens/Activity";
import { Home } from "@/screens/Home";
import { Rewards } from "@/screens/Rewards";
import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import { readFileSync } from "fs";
import path from "path";

export interface State {
  screen: "home";
}

export const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/",
  initialState: {
    screen: "home",
  },
  imageAspectRatio: "1:1",
  imageOptions: {
    debug: false,
    width: 1200,
    height: 1200,
    fonts: [
      {
        name: "Agrandir",
        weight: 500,
        data: readFileSync(
          path.resolve(process.cwd(), "./fonts/PPAgrandir-Medium.ttf"),
        ),
      },
      {
        name: "Beatrice",
        weight: 500,
        data: readFileSync(
          path.resolve(process.cwd(), "./fonts/Beatrice-Medium.ttf"),
        ),
      },
    ],
  },
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

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

export const GET = handle(app);
export const POST = handle(app);
