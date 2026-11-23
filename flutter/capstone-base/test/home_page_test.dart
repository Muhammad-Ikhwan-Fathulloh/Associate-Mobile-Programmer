import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:capstone_base/pages/home_page.dart';

void main() {
  testWidgets('HomePage menampilkan menu utama', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomePage()));

    expect(find.text('Catatan'), findsOneWidget);
    expect(find.text('Lokasi dan Peta'), findsOneWidget);
    expect(find.text('API dan Sinkronisasi'), findsOneWidget);
    expect(find.text('Jaringan'), findsOneWidget);
    expect(find.text('Sensor'), findsOneWidget);
    expect(find.text('Informasi Perangkat'), findsOneWidget);
    expect(find.text('Keamanan dan HTTPS'), findsOneWidget);
  });
}
