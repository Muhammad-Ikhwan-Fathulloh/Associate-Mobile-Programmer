export type TitikPeta = { latitude: number; longitude: number; judul?: string };

/** HTML peta OpenStreetMap (Leaflet) yang dimuat di WebView, tanpa API key. */
export function buatHtmlPeta({ latitude, longitude, judul }: TitikPeta): string {
  const teks = JSON.stringify(judul ?? 'Posisi Anda');
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>html,body,#m{height:100%;margin:0}</style></head><body><div id="m"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map = L.map('m').setView([${latitude}, ${longitude}], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
L.marker([${latitude}, ${longitude}]).addTo(map).bindPopup(${teks}).openPopup();
</script></body></html>`;
}

