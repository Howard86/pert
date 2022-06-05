export const getPertAverage = (
  optimistic: number,
  likely: number,
  pessimistic: number,
) => (optimistic + 4 * likely + pessimistic) / 6;

export const getPertVariance = (optimistic: number, pessimistic: number) =>
  (pessimistic - optimistic) / 6;

export const getTotalAverage = (...averages: number[]) =>
  averages.reduce((sum, average) => sum + average, 0);

export const getTotalVariance = (...variances: number[]) =>
  Math.sqrt(variances.reduce((sum, variance) => sum + variance * variance, 0));
