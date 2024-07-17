/** @jsxImportSource frog/jsx */

import { AboutImage, AboutScreen } from "@/screens/About";
import { ActivityImage, ActivityScreen } from "@/screens/Activity";
import { HomeImage, HomeScreen } from "@/screens/Home";
import { RewardsImage, RewardsScreen } from "@/screens/Rewards";
import { Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { readFileSync } from "node:fs";
import path from "node:path";

const app = new Frog({
  title: "Juicebox",
  assetsPath: "/",
  basePath: "/",
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

app.frame("/:id", HomeScreen);
app.image("/:id/images/home", HomeImage);

app.frame("/:id/about", AboutScreen);
app.image("/:id/images/about", AboutImage);

app.frame("/:id/activity", ActivityScreen);
app.image("/:id/images/activity", ActivityImage);

app.frame("/:id/rewards", RewardsScreen);
app.image("/:id/images/rewards", RewardsImage);

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
