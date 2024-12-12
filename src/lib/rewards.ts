"use server";

import { getCycle } from "@/api/cycle";

export async function getCycleData({
  projectId,
  cycleId,
}: {
  projectId: number;
  cycleId: number;
}) {
  const cycleData = await getCycle({
    projectId,
    cycleId,
  });

  if (!cycleData) return null;

  return cycleData;
}
