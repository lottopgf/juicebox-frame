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
    debug: import.meta.env.VITE_FRAME_DEBUG_MODE === "true",
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
