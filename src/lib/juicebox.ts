const BPS = 10_000n;
const WAD = BigInt(1e18);

export function getTokensPerEth({
  reservedRate,
  weight,
}: {
  reservedRate: number;
  weight: bigint;
}) {
  return (WAD * ((1n - BigInt(reservedRate) / BPS) * weight)) / WAD;
}

// @see https://github.com/jbx-protocol/juice-interface/blob/26aa025aef8fe2f04df446154acb827c037b32d4/src/hooks/useProjects.ts#L102
export function getTrendingPercentage({
  totalVolume,
  trendingVolume,
}: {
  totalVolume: bigint;
  trendingVolume: bigint;
}) {
  const preTrendingVolume = totalVolume - trendingVolume;

  if (preTrendingVolume <= 0n) return Infinity;

  const percentGain = Number((trendingVolume * 10_000n) / preTrendingVolume);

  let percentRounded: number;

  // If percentGain > 1, round to int
  if (percentGain >= 100) {
    percentRounded = Math.round(percentGain / 100);
    // If 0.1 <= percentGain < 1, round to 1dp
  } else if (percentGain >= 10) {
    percentRounded = Math.round(percentGain / 10) / 10;
    // If percentGain < 0.1, round to 2dp
  } else {
    percentRounded = percentGain / 100;
  }

  return percentRounded;
}
