import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:associate_mobile_app/pages/home_page.dart';

void main() {
  testWidgets('HomePage menampilkan menu utama', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomePage()));

    expect(find.text('Catatan Lokal'), findsOneWidget);
    expect(find.text('Lokasi dan Peta'), findsOneWidget);
    expect(find.text('Jaringan Seluler'), findsOneWidget);
    expect(find.text('Sensor'), findsOneWidget);
    expect(find.text('Informasi Perangkat'), findsOneWidget);
    expect(find.text('Keamanan dan HTTPS'), findsOneWidget);
  });
}
