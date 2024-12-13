/** @jsxImportSource frog/jsx */

import { APP_URL } from "@/lib/config";
import { getProjectId } from "@/lib/parameters";
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
          path.resolve(process.cwd(), "./fonts/PPAgrandir-Medium.ttf"),
        ),
      },
      {
        name: "Beatrice",
        weight: 400,
        data: readFileSync(
          path.resolve(process.cwd(), "./fonts/Beatrice-Regular.ttf"),
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
app.frame("/:id/rewards/:rewardId", RewardsScreen);
app.image("/:id/images/rewards/:rewardId", RewardsImage);

app.miniApp(
  "/:id/payment/miniapp",
  (ctx) => {
    const projectId = getProjectId(ctx);
    return ctx.res({
      title: "Juicebox Frame",
      url: `${APP_URL}/${projectId}/~/miniapps/payment`,
    });
  },
  {
    name: "Juicebox Frame",
    description: "Contribute to Juicebox projects through a frame!",
    imageUrl: "",
    icon: "hash",
  },
);

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
