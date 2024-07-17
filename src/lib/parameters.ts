import type { HonoRequest } from "hono";

export function getProjectId(ctx: { req: HonoRequest }) {
  const projectId = ctx.req.param("id");

  if (!projectId || isNaN(parseInt(projectId))) {
    throw new Error("Project ID invalid");
  }

  return Number(projectId);
}
