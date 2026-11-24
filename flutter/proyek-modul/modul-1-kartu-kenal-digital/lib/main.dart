import 'package:flutter/material.dart';

import 'profil.dart';
import 'widgets/kartu.dart';

void main() => runApp(const AplikasiKartu());

class AplikasiKartu extends StatelessWidget {
  const AplikasiKartu({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Kenal Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanKartu(),
    );
  }
}

class HalamanKartu extends StatefulWidget {
  const HalamanKartu({super.key});

  @override
  State<HalamanKartu> createState() => _HalamanKartuState();
}

class _HalamanKartuState extends State<HalamanKartu> {
  bool _tampilkanKeahlian = true;

  @override
  Widget build(BuildContext context) {
    const profil = profilSaya;
    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Kenal Digital')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Kartu(
            judul: 'Profil',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 32,
                  child: Text(inisial(profil.nama), style: const TextStyle(fontSize: 22)),
                ),
                const SizedBox(height: 8),
                Text(profil.nama, style: Theme.of(context).textTheme.headlineSmall),
                Text(profil.peran),
              ],
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () => setState(() => _tampilkanKeahlian = !_tampilkanKeahlian),
            child: Text(_tampilkanKeahlian ? 'Sembunyikan keahlian' : 'Tampilkan keahlian'),
          ),
          if (_tampilkanKeahlian) ...[
            const SizedBox(height: 12),
            Kartu(
              judul: 'Keahlian',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [for (final k in profil.keahlian) Text('• $k')],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
