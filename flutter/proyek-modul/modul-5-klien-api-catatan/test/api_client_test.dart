import 'dart:async';
import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:modul_5_klien_api_catatan/services/api_client.dart';
import 'package:modul_5_klien_api_catatan/services/pesan_error.dart';

const _base = 'https://contoh.mockapi.io/api/v1/notes';

http.Response _json(int status, Object body) =>
    http.Response(jsonEncode(body), status, headers: {'content-type': 'application/json'});

void main() {
  test('Read: GET ke alamat resource dan membaca id berupa string', () async {
    late http.BaseRequest terkirim;
    final api = ApiClient(_base, client: MockClient((req) async {
      terkirim = req;
      return _json(200, [{'id': '1', 'title': 'A', 'content': '', 'latitude': null, 'longitude': null}]);
    }));
    final daftar = await api.daftar();
    expect(daftar.single.id, '1');
    expect(terkirim.method, 'GET');
    expect(terkirim.url.toString(), _base);
  });

  test('Create: POST dengan badan JSON', () async {
    late http.BaseRequest terkirim;
    final api = ApiClient(_base, client: MockClient((req) async {
      terkirim = req;
      return _json(201, {'id': '42', 'title': 'Baru', 'content': 'x', 'latitude': null, 'longitude': null});
    }));
    final c = await api.buat(const Catatan(id: '', title: 'Baru', content: 'x'));
    expect(c.id, '42');
    expect(terkirim.method, 'POST');
    expect((terkirim as http.Request).body, '{"title":"Baru","content":"x","latitude":null,"longitude":null}');
  });

  test('Update: PUT ke alamat dengan id', () async {
    late http.BaseRequest terkirim;
    final api = ApiClient(_base, client: MockClient((req) async {
      terkirim = req;
      return _json(200, {'id': '7', 'title': 'Ubah', 'content': '', 'latitude': null, 'longitude': null});
    }));
    await api.ubah('7', const Catatan(id: '7', title: 'Ubah', content: ''));
    expect(terkirim.method, 'PUT');
    expect(terkirim.url.toString(), '$_base/7');
  });

  test('Delete: DELETE ke alamat dengan id, status 204 tidak error', () async {
    late http.BaseRequest terkirim;
    final api = ApiClient(_base, client: MockClient((req) async {
      terkirim = req;
      return http.Response('', 204);
    }));
    await expectLater(api.hapus('7'), completes);
    expect(terkirim.method, 'DELETE');
    expect(terkirim.url.toString(), '$_base/7');
  });

  test('id yang tidak ada (404) memberi pesan dari server', () async {
    final api = ApiClient(_base, client: MockClient((_) async => _json(404, {'error': 'Catatan tidak ditemukan.'})));
    final galat = await api.ubah('9', const Catatan(id: '9', title: 'x', content: '')).then<Object?>((_) => null, onError: (Object e) => e);
    expect(galat, isA<ApiException>());
    expect(pesanRamah(galat!), 'Catatan tidak ditemukan.');
  });

  test('server tidak terjangkau memberi pesan yang ramah', () async {
    final api = ApiClient(_base, client: MockClient((_) async => throw http.ClientException('Connection refused')));
    final galat = await api.daftar().then<Object?>((_) => null, onError: (Object e) => e);
    expect(pesanRamah(galat!), contains('tidak dapat dijangkau'));
  });

  test('batas waktu memberi pesan yang sesuai', () async {
    final api = ApiClient(
      _base,
      batas: const Duration(milliseconds: 20),
      client: MockClient((_) => Future.delayed(const Duration(seconds: 1), () => _json(200, []))),
    );
    final galat = await api.daftar().then<Object?>((_) => null, onError: (Object e) => e);
    expect(galat, isA<TimeoutException>());
    expect(pesanRamah(galat!), contains('terlalu lama'));
  });

  test('alamat http publik ditolak sebelum permintaan dikirim', () async {
    var terkirim = false;
    final api = ApiClient('http://contoh.com/notes', client: MockClient((_) async {
      terkirim = true;
      return _json(200, []);
    }));
    await expectLater(api.daftar(), throwsA(isA<ArgumentError>()));
    expect(terkirim, isFalse);
    expect(periksaUrlApi(_base), isNull);
  });
}
