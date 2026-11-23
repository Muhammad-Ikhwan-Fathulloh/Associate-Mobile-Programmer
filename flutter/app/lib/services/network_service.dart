import 'package:connectivity_plus/connectivity_plus.dart';

/// Mengubah hasil connectivity_plus menjadi label yang mudah dibaca.
String labelJaringan(List<ConnectivityResult> hasil) {
  if (hasil.isEmpty || hasil.contains(ConnectivityResult.none)) {
    return 'Tidak ada koneksi';
  }
  if (hasil.contains(ConnectivityResult.wifi)) return 'Wi-Fi';
  if (hasil.contains(ConnectivityResult.mobile)) return 'Seluler';
  if (hasil.contains(ConnectivityResult.ethernet)) return 'Ethernet';
  if (hasil.contains(ConnectivityResult.vpn)) return 'VPN';
  return 'Lainnya';
}

class NetworkService {
  NetworkService({Connectivity? connectivity})
      : _connectivity = connectivity ?? Connectivity();

  final Connectivity _connectivity;

  Future<List<ConnectivityResult>> periksa() {
    return _connectivity.checkConnectivity();
  }

  Stream<List<ConnectivityResult>> get perubahan {
    return _connectivity.onConnectivityChanged;
  }
}
