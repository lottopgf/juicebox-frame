import { APP_URL } from "../../../lib/config";

export async function GET() {
  const config = {
    frame: {
      version: "0.0.0",
      name: "Juicebox Frame",
      iconUrl: `${APP_URL}/favicon.ico`,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#16141d",
      homeUrl: APP_URL,
    },
  };

  return Response.json(config);
}
