import 'dart:async';
import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:modul_5_klien_api_catatan/services/api_client.dart';
import 'package:modul_5_klien_api_catatan/services/pesan_error.dart';

http.Response _json(int status, Object body) => http.Response(jsonEncode(body), status, headers: {'content-type': 'application/json'});

void main() {
  test('login salah (401) menampilkan pesan dari server', () async {
    final api = ApiClient('http://10.0.2.2:3000',
        client: MockClient((_) async => _json(401, {'error': 'Email atau kata sandi salah.'})));
    await expectLater(
      api.login('a', 'salah'),
      throwsA(isA<ApiException>().having((e) => e.status, 'status', 401)),
    );
    await api.login('a', 'salah').catchError((Object e) {
      expect(pesanRamah(e), 'Email atau kata sandi salah.');
      return '';
    });
  });

  test('judul kosong ditolak server (400) dan pesannya tampil', () async {
    final api = ApiClient('http://10.0.2.2:3000',
        client: MockClient((_) async => _json(400, {'error': 'Judul wajib diisi.'})));
    final galat = await api.buatCatatan('tok', {'title': '', 'content': ''}).then<Object?>((_) => null, onError: (Object e) => e);
    expect(pesanRamah(galat!), 'Judul wajib diisi.');
  });

  test('status 204 tidak menyebabkan error pembacaan JSON', () async {
    final api = ApiClient('http://10.0.2.2:3000', client: MockClient((_) async => http.Response('', 204)));
    await expectLater(api.hapusCatatan('tok', 1), completes);
  });

  test('login sukses mengembalikan token dan mengirim email serta kata sandi', () async {
    late http.BaseRequest terkirim;
    final api = ApiClient('http://10.0.2.2:3000', client: MockClient((req) async {
      terkirim = req;
      return _json(200, {'token': 'abc'});
    }));
    expect(await api.login('a@b.id', 'rahasia'), 'abc');
    expect(terkirim.url.toString(), 'http://10.0.2.2:3000/login');
  });

  test('server mati menghasilkan pesan yang ramah, bukan galat teknis', () async {
    final api = ApiClient('http://10.0.2.2:3000', client: MockClient((_) async => throw http.ClientException('Connection refused')));
    final galat = await api.daftarCatatan('tok').then<Object?>((_) => null, onError: (Object e) => e);
    expect(pesanRamah(galat!), contains('tidak dapat dijangkau'));
  });

  test('permintaan yang melewati batas waktu diberi pesan', () async {
    final api = ApiClient(
      'http://10.0.2.2:3000',
      batas: const Duration(milliseconds: 20),
      client: MockClient((_) => Future.delayed(const Duration(seconds: 1), () => _json(200, []))),
    );
    final galat = await api.daftarCatatan('tok').then<Object?>((_) => null, onError: (Object e) => e);
    expect(galat, isA<TimeoutException>());
    expect(pesanRamah(galat!), contains('terlalu lama'));
  });

  test('alamat publik http ditolak sebelum permintaan dikirim', () async {
    var terkirimSesuatu = false;
    final api = ApiClient('http://contoh.com', client: MockClient((_) async {
      terkirimSesuatu = true;
      return _json(200, {});
    }));
    await expectLater(api.login('a', 'b'), throwsA(isA<ArgumentError>()));
    expect(terkirimSesuatu, isFalse);
    expect(periksaUrlApi('https://contoh.com'), isNull);
  });
}
