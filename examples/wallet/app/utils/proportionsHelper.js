import type { Delegation, PoolId } from '../models';

export const totalParts = (delegation?: Delegation): number =>
  delegation
    ? Object.values(delegation).reduce((acc: number, it) => acc + it.parts, 0)
    : 0;

export const percentageFromParts = (
  delegation?: Delegation,
  poolId: PoolId
) => {
  const total = totalParts(delegation);
  if (!total) return 0;
  return delegation[poolId]
    ? parseInt((100 * delegation[poolId].parts) / total, 10)
    : 0;
};
