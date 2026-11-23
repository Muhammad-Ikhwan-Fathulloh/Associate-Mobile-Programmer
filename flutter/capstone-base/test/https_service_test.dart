import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:capstone_base/services/https_service.dart';

void main() {
  test('URL tanpa skema tidak valid', () {
    expect(periksaUrlAman('bukan url'), 'URL tidak valid.');
  });

  test('URL http ditolak', () {
    expect(periksaUrlAman('http://contoh.test/data'), 'Gunakan HTTPS (https://).');
  });

  test('URL https diterima', () {
    expect(periksaUrlAman('https://contoh.test/data'), isNull);
  });

  test('ambilJson mengembalikan data saat status 200', () async {
    final service = HttpsService(
      client: MockClient(
        (request) async => http.Response('{"title": "Contoh"}', 200),
      ),
    );

    final data = await service.ambilJson('https://contoh.test/post');

    expect((data as Map)['title'], 'Contoh');
  });

  test('ambilJson melempar error saat status bukan 200', () async {
    final service = HttpsService(
      client: MockClient((request) async => http.Response('gagal', 500)),
    );

    await expectLater(
      service.ambilJson('https://contoh.test/post'),
      throwsException,
    );
  });

  test('ambilJson menolak URL http tanpa mengirim request', () async {
    final service = HttpsService(
      client: MockClient((request) async {
        fail('Request tidak boleh dikirim untuk URL http');
      }),
    );

    await expectLater(
      service.ambilJson('http://contoh.test/post'),
      throwsArgumentError,
    );
  });
}
