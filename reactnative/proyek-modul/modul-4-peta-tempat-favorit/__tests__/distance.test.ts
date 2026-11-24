import { formatJarak, jarakMeter } from '../src/services/distance';
import { tempatUntukPeta, urutkanJarak } from '../src/services/tempat';
import { buatHtmlPeta } from '../src/services/petaHtml';
import { Tempat } from '../src/models/tempat';

describe('jarakMeter (Haversine)', () => {
  it('Bandung ke Jakarta sekitar 120 km (toleransi 5 km)', () => {
    const meter = jarakMeter(-6.9175, 107.6191, -6.2088, 106.8456);
    expect(meter).toBeGreaterThan(115000);
    expect(meter).toBeLessThan(125000);
  });
  it('titik yang sama berjarak 0', () => {
    expect(jarakMeter(-6.9, 107.6, -6.9, 107.6)).toBeCloseTo(0, 6);
  });
});

describe('formatJarak', () => {
  it('meter di bawah 1 km, kilometer selain itu', () => {
    expect(formatJarak(850.4)).toBe('850 m');
    expect(formatJarak(1500)).toBe('1.5 km');
  });
});

const daftar: Tempat[] = [
  { id: 1, nama: 'Jauh', latitude: -6.2088, longitude: 106.8456 },
  { id: 2, nama: 'Tanpa lokasi', latitude: null, longitude: null },
  { id: 3, nama: 'Dekat', latitude: -6.9176, longitude: 107.6192 },
];

describe('tempatUntukPeta', () => {
  it('membuang tempat tanpa koordinat', () => {
    expect(tempatUntukPeta(daftar).map((t) => t.nama)).toEqual(['Jauh', 'Dekat']);
  });
});

describe('urutkanJarak', () => {
  const posisi = { latitude: -6.9175, longitude: 107.6191 };
  it('mengurutkan dari yang terdekat dan meletakkan tanpa koordinat di akhir', () => {
    const hasil = urutkanJarak(daftar, posisi);
    expect(hasil.map((t) => t.nama)).toEqual(['Dekat', 'Jauh', 'Tanpa lokasi']);
    expect(hasil[2].jarakM).toBeNull();
  });
});

describe('buatHtmlPeta', () => {
  it('membuat satu penanda untuk setiap titik', () => {
    const html = buatHtmlPeta({ latitude: 1, longitude: 2 }, [
      { latitude: 1, longitude: 2, judul: 'A' },
      { latitude: 3, longitude: 4, judul: 'B' },
    ]);
    expect(html.match(/L\.marker\(/g)).toHaveLength(2);
  });
  it('nama tempat yang berisi tag script tidak menutup blok skrip', () => {
    const html = buatHtmlPeta({ latitude: 1, longitude: 2 }, [{ latitude: 1, longitude: 2, judul: '</script><b>x' }]);
    expect(html).not.toContain('</script><b>');
  });
});
