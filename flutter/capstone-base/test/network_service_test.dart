import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:capstone_base/services/network_service.dart';

void main() {
  test('daftar kosong dianggap tidak ada koneksi', () {
    expect(labelJaringan([]), 'Tidak ada koneksi');
  });

  test('ConnectivityResult.none menghasilkan tidak ada koneksi', () {
    expect(labelJaringan([ConnectivityResult.none]), 'Tidak ada koneksi');
  });

  test('Wi-Fi terdeteksi dengan benar', () {
    expect(labelJaringan([ConnectivityResult.wifi]), 'Wi-Fi');
  });

  test('seluler terdeteksi dengan benar', () {
    expect(labelJaringan([ConnectivityResult.mobile]), 'Seluler');
  });

  test('Wi-Fi lebih diutamakan jika kedua jenis koneksi aktif', () {
    expect(
      labelJaringan([ConnectivityResult.mobile, ConnectivityResult.wifi]),
      'Wi-Fi',
    );
  });
}
