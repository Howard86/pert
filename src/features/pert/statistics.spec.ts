import {
  getPertAverage,
  getPertVariance,
  getTotalAverage,
  getTotalVariance,
} from './statistics';

describe('statistics', () => {
  it('should calculate PERT average', () => {
    expect.hasAssertions();
    expect(getPertAverage(1, 1, 1)).toBe(1);
    expect(getPertAverage(1, 3, 11)).toBe(4);
    expect(getPertAverage(2, 10, 12)).toBe(9);
  });

  it('should calculate PERT variance', () => {
    expect.hasAssertions();
    expect(getPertVariance(6, 12)).toBe(1);
    expect(getPertVariance(1, 13)).toBe(2);
    expect(getPertVariance(4, 7)).toBe(0.5);
    expect(getPertVariance(100, 220)).toBe(20);
  });

  it('should calculate total average', () => {
    expect.hasAssertions();
    expect(getTotalAverage(5, 10)).toBe(15);
    expect(getTotalAverage(5, 10, 16)).toBe(31);
    expect(getTotalAverage(5, 10, 16, 20)).toBe(51);
  });

  it('should calculate total variance', () => {
    expect.hasAssertions();
    expect(getTotalVariance(3, 4)).toBe(5);
    expect(getTotalVariance(5, 12)).toBe(13);
  });
});
