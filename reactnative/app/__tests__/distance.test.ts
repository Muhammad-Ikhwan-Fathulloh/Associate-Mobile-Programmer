import { jarakMeter } from '../src/services/distance';

describe('jarakMeter (Haversine)', () => {
  it('bernilai 0 untuk titik yang sama', () => {
    expect(jarakMeter(-6.9, 107.6, -6.9, 107.6)).toBeCloseTo(0, 5);
  });
  it('Bandung ke Jakarta sekitar 116 km', () => {
    const km = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456) / 1000;
    expect(km).toBeGreaterThan(110);
    expect(km).toBeLessThan(125);
  });
  it('simetris', () => {
    expect(jarakMeter(0, 0, 1, 1)).toBeCloseTo(jarakMeter(1, 1, 0, 0), 6);
  });
});
