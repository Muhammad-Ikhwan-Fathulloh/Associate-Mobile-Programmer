import { buatHtmlPeta } from '../src/services/petaHtml';

it('HTML peta memuat koordinat dan tile OpenStreetMap', () => {
  const h = buatHtmlPeta({ latitude: -6.9, longitude: 107.6, judul: 'Tes' });
  expect(h).toContain('[-6.9, 107.6]');
  expect(h).toContain('tile.openstreetmap.org');
});
