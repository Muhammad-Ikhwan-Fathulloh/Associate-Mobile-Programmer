import { arahKompas, besarVektor, mataAngin, PendeteksiGuncangan, terdeteksiGuncangan } from '../src/services/sensorMath';

describe('terdeteksiGuncangan', () => {
  const v = (x: number) => ({ x, y: 0, z: 0 });
  it('diam di meja (sekitar 1 g) tidak terhitung', () => {
    expect(terdeteksiGuncangan({ x: 0, y: 0, z: 1 })).toBe(false);
  });
  it('di bawah ambang tidak terhitung', () => {
    expect(terdeteksiGuncangan(v(1.9), 2)).toBe(false);
  });
  it('tepat di ambang belum terhitung', () => {
    expect(terdeteksiGuncangan(v(2), 2)).toBe(false);
  });
  it('di atas ambang terhitung', () => {
    expect(terdeteksiGuncangan(v(2.1), 2)).toBe(true);
  });
  it('besar vektor memakai Pythagoras tiga sumbu', () => {
    expect(besarVektor({ x: 3, y: 4, z: 0 })).toBeCloseTo(5);
  });
});

describe('PendeteksiGuncangan', () => {
  const kuat = { x: 3, y: 0, z: 0 };
  const diam = { x: 0, y: 0, z: 1 };

  it('satu guncangan yang berlangsung beberapa pembacaan hanya dihitung sekali', () => {
    const p = new PendeteksiGuncangan(2, 800);
    const hitung = [0, 100, 200, 300].filter((t) => p.masukkan(kuat, t)).length;
    expect(hitung).toBe(1);
  });
  it('guncangan setelah jeda dihitung lagi', () => {
    const p = new PendeteksiGuncangan(2, 800);
    expect(p.masukkan(kuat, 0)).toBe(true);
    expect(p.masukkan(diam, 900)).toBe(false);
    expect(p.masukkan(kuat, 1000)).toBe(true);
  });
});

describe('arahKompas dan mataAngin', () => {
  it('mataAngin(0) bernilai U dan mataAngin(90) bernilai T', () => {
    expect(mataAngin(0)).toBe('U');
    expect(mataAngin(90)).toBe('T');
  });
  it('sudut negatif dan lebih dari 360 tetap valid', () => {
    expect(mataAngin(-90)).toBe('B');
    expect(mataAngin(450)).toBe('T');
  });
  it('arahKompas selalu berada di rentang 0 sampai 360', () => {
    const d = arahKompas({ x: 10, y: -3 });
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThan(360);
  });
});
