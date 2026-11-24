import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Token disimpan di penyimpanan aman perangkat, bukan di SQLite.
const _kunci = 'token_jurnal';

const _penyimpanan = FlutterSecureStorage();

Future<void> simpanToken(String token) => _penyimpanan.write(key: _kunci, value: token);

Future<String?> bacaToken() => _penyimpanan.read(key: _kunci);

Future<void> hapusToken() => _penyimpanan.delete(key: _kunci);
