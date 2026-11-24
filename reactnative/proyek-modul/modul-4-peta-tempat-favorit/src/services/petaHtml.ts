import { Koordinat } from '../models/tempat';

export type TitikPeta = Koordinat & { judul: string };

// JSON.stringify lalu '<' diganti escape, agar nama tempat tidak bisa menutup tag <script>.
const teksAman = (t: string) => JSON.stringify(t).replace(/</g, '\\u003c');

/** HTML peta OpenStreetMap (Leaflet) untuk WebView, tanpa API key. */
export function buatHtmlPeta(pusat: Koordinat, titik: TitikPeta[]): string {
  const penanda = titik
    .map((t) => `L.marker([${t.latitude}, ${t.longitude}]).addTo(map).bindPopup(${teksAman(t.judul)});`)
    .join('\n');
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#m{height:100%;margin:0}</style></head><body><div id="m"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('m').setView([${pusat.latitude}, ${pusat.longitude}], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
${penanda}
</script></body></html>`;
}
