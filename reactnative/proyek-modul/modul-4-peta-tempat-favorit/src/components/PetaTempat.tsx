import { WebView } from 'react-native-webview';
import { buatHtmlPeta, TitikPeta } from '../services/petaHtml';
import { Koordinat } from '../models/tempat';

export function PetaTempat({ pusat, titik }: { pusat: Koordinat; titik: TitikPeta[] }) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: buatHtmlPeta(pusat, titik) }}
      style={{ flex: 1, minHeight: 280 }}
    />
  );
}
