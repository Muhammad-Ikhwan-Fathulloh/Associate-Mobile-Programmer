import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _kunciToken = 'token';

  Future<void> simpanToken(String token) {
    return _storage.write(key: _kunciToken, value: token);
  }

  Future<String?> ambilToken() {
    return _storage.read(key: _kunciToken);
  }

  Future<void> hapusToken() {
    return _storage.delete(key: _kunciToken);
  }
}
