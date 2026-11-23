import { arahKompas, besarVektor, mataAngin, terdeteksiGuncangan } from '../src/services/sensorMath';

describe('sensorMath', () => {
  it('besar vektor diam di meja sekitar 1 g', () => {
    expect(besarVektor({ x: 0, y: 0, z: 1 })).toBeCloseTo(1, 5);
  });
  it('guncangan terdeteksi di atas ambang', () => {
    expect(terdeteksiGuncangan({ x: 0, y: 0, z: 1 })).toBe(false);
    expect(terdeteksiGuncangan({ x: 2, y: 1.5, z: 1 })).toBe(true);
    expect(terdeteksiGuncangan({ x: 0, y: 0, z: 1.5 }, 1.2)).toBe(true);
  });
  it('arah kompas: medan di sumbu +y berarti utara', () => {
    expect(arahKompas({ x: 0, y: 1 })).toBeCloseTo(0, 5);
    expect(arahKompas({ x: -1, y: 0 })).toBeCloseTo(90, 5);
    expect(arahKompas({ x: 0, y: -1 })).toBeCloseTo(180, 5);
    expect(arahKompas({ x: 1, y: 0 })).toBeCloseTo(270, 5);
  });
  it('nama mata angin', () => {
    expect(mataAngin(0)).toBe('Utara');
    expect(mataAngin(90)).toBe('Timur');
    expect(mataAngin(359)).toBe('Utara');
    expect(mataAngin(225)).toBe('Barat Daya');
  });
});
