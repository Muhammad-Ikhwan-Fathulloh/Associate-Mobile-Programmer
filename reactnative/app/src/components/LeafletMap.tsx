import { WebView } from 'react-native-webview';
import { buatHtmlPeta, TitikPeta } from '../services/petaHtml';

export function LeafletMap(props: TitikPeta) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: buatHtmlPeta(props) }}
      style={{ flex: 1, minHeight: 280 }}
    />
  );
}
