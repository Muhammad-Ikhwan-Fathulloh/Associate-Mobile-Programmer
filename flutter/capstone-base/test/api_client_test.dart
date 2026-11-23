import 'dart:convert';

import 'package:capstone_base/services/api_client.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('periksaUrlApi menolak http publik dan menerima alamat lokal', () {
    expect(periksaUrlApi('http://contoh.com'), isNotNull);
    expect(periksaUrlApi('https://contoh.com'), isNull);
    expect(periksaUrlApi('http://10.0.2.2:3000'), isNull);
    expect(periksaUrlApi('http://192.168.1.5:3000'), isNull);
    expect(periksaUrlApi('http://172.20.0.1'), isNull);
    expect(periksaUrlApi('http://172.40.0.1'), isNotNull);
  });

  test('login mengembalikan token', () async {
    final client = MockClient((req) async {
      expect(req.method, 'POST');
      expect(req.url.path, '/login');
      return http.Response(jsonEncode({'token': 'abc'}), 200);
    });
    final api = ApiClient('http://10.0.2.2:3000', client: client);
    expect(await api.login('a@b.c', 'x'), 'abc');
  });

  test('daftarCatatan mengirim header Authorization', () async {
    final client = MockClient((req) async {
      expect(req.headers['Authorization'], 'Bearer tok');
      return http.Response('[]', 200);
    });
    final api = ApiClient('http://localhost:3000', client: client);
    expect(await api.daftarCatatan('tok'), isEmpty);
  });

  test('status error menjadi ApiException dengan pesan server', () async {
    final client = MockClient(
      (req) async => http.Response(jsonEncode({'error': 'Perlu login'}), 401),
    );
    final api = ApiClient('http://localhost:3000', client: client);
    expect(
      () => api.daftarCatatan('x'),
      throwsA(isA<ApiException>().having((e) => e.pesan, 'pesan', 'Perlu login')),
    );
  });
}
