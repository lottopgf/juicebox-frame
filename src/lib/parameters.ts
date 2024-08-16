import type { HonoRequest } from "hono";

export function getProjectId(ctx: { req: HonoRequest }) {
  const projectId = ctx.req.param("id");

  if (!projectId || isNaN(parseInt(projectId))) {
    throw new Error("Project ID invalid");
  }

  return Number(projectId);
}

export function getRewardId(ctx: { req: HonoRequest }) {
  const rewardId = ctx.req.param("rewardId");

  if (rewardId === undefined) {
    return 0;
  }

  if (!rewardId || isNaN(parseInt(rewardId))) {
    throw new Error("Reward ID invalid");
  }

  return Number(rewardId);
}
