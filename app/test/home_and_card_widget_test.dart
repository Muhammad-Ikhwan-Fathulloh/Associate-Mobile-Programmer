import 'package:associate_mobile_app/models/post.dart';
import 'package:associate_mobile_app/pages/home_page.dart';
import 'package:associate_mobile_app/widgets/post_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('HomePage menampilkan tiga menu utama', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: HomePage()));

    expect(find.text('Catatan Lokal'), findsOneWidget);
    expect(find.text('Lokasi dan Peta'), findsOneWidget);
    expect(find.text('Daftar Post API'), findsOneWidget);
  });

  testWidgets('PostCard menampilkan judul dan memanggil onTap', (tester) async {
    var ditekan = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PostCard(
            post: const Post(id: 1, judul: 'Judul kartu', isi: 'Isi kartu'),
            onTap: () => ditekan = true,
          ),
        ),
      ),
    );

    expect(find.text('Judul kartu'), findsOneWidget);

    await tester.tap(find.text('Judul kartu'));
    await tester.pump();

    expect(ditekan, isTrue);
  });
}
