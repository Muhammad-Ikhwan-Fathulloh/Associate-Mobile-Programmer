import 'package:flutter/material.dart';

import 'bukti.dart';

void main() => runApp(const AplikasiBukti());

class AplikasiBukti extends StatelessWidget {
  const AplikasiBukti({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Paket Bukti Kompetensi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanBukti(),
    );
  }
}

const _langkahDemo = [
  'Buka aplikasi dan tunjukkan layar tiap modul.',
  'Jelaskan satu unit: berkas mana yang membuktikannya.',
  'Tunjukkan satu kasus gagal yang ditangani (misalnya izin lokasi ditolak).',
  'Jalankan flutter test dan tunjukkan hasilnya hijau.',
];

class HalamanBukti extends StatefulWidget {
  const HalamanBukti({super.key});

  @override
  State<HalamanBukti> createState() => _HalamanBuktiState();
}

class _HalamanBuktiState extends State<HalamanBukti> {
  final _siap = <String>{};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bukti Kompetensi')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              title: const Text('Bukti kompetensi'),
              subtitle: Text('${_siap.length} dari ${buktiKompetensi.length} unit siap ditunjukkan.'),
            ),
          ),
          for (final b in buktiKompetensi)
            Card(
              child: CheckboxListTile(
                value: _siap.contains(b.unit),
                title: Text(b.judul),
                subtitle: Text('${b.unit}\n${b.folder}/${b.berkas}'),
                isThreeLine: true,
                onChanged: (v) => setState(() => v! ? _siap.add(b.unit) : _siap.remove(b.unit)),
              ),
            ),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Skrip demo lima menit', style: Theme.of(context).textTheme.titleMedium),
                  for (var i = 0; i < _langkahDemo.length; i++) Text('${i + 1}. ${_langkahDemo[i]}'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
