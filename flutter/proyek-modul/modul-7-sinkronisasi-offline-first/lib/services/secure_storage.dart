import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Token disimpan di penyimpanan aman perangkat (Keystore di Android, Keychain di iOS), bukan di SQLite.
const _kunci = 'token_sesi';

const _penyimpanan = FlutterSecureStorage();

Future<void> simpanToken(String token) => _penyimpanan.write(key: _kunci, value: token);

Future<String?> bacaToken() => _penyimpanan.read(key: _kunci);

Future<void> hapusToken() => _penyimpanan.delete(key: _kunci);
