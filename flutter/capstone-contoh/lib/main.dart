import 'package:flutter/material.dart';

import 'config.dart';
import 'data/entri_repository.dart';
import 'models/entri.dart';
import 'pages/detail_entri.dart';
import 'pages/form_entri.dart';
import 'pages/kompas_page.dart';
import 'pages/sinkron_page.dart';

void main() => runApp(const AplikasiJurnal());

class AplikasiJurnal extends StatelessWidget {
  const AplikasiJurnal({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: namaAplikasi,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const BerandaJurnal(),
    );
  }
}

class BerandaJurnal extends StatefulWidget {
  const BerandaJurnal({super.key});

  @override
  State<BerandaJurnal> createState() => _BerandaJurnalState();
}

class _BerandaJurnalState extends State<BerandaJurnal> {
  final _repo = EntriRepository();
  List<Entri> _daftar = [];
  String? _filter;

  @override
  void initState() {
    super.initState();
    _muat();
  }

  Future<void> _muat() async {
    final daftar = await _repo.ambilSemua(kategori: _filter);
    if (mounted) setState(() => _daftar = daftar);
  }

  Future<void> _buka(Widget halaman) async {
    await Navigator.of(context).push(MaterialPageRoute(builder: (_) => halaman));
    await _muat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(namaAplikasi),
        actions: [
          IconButton(tooltip: 'Kompas tujuan', icon: const Icon(Icons.explore), onPressed: () => _buka(const KompasPage())),
          IconButton(tooltip: 'Sinkronisasi', icon: const Icon(Icons.sync), onPressed: () => _buka(const SinkronPage())),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _buka(const FormEntri()),
        icon: const Icon(Icons.add),
        label: const Text('Entri baru'),
      ),
      body: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                FilterChip(
                  label: const Text('Semua'),
                  selected: _filter == null,
                  onSelected: (_) => setState(() {
                    _filter = null;
                    _muat();
                  }),
                ),
                for (final k in kategoriEntri)
                  Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: FilterChip(
                      label: Text(k),
                      selected: _filter == k,
                      onSelected: (_) => setState(() {
                        _filter = k;
                        _muat();
                      }),
                    ),
                  ),
              ],
            ),
          ),
          Expanded(
            child: _daftar.isEmpty
                ? const Center(child: Text('Belum ada entri. Tambahkan perjalanan pertama.'))
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(12, 0, 12, 96),
                    itemCount: _daftar.length,
                    itemBuilder: (context, i) {
                      final e = _daftar[i];
                      return Card(
                        child: ListTile(
                          title: Text(e.judul),
                          subtitle: Text('${e.kategori} · ${e.punyaKoordinat ? 'ada lokasi' : 'tanpa lokasi'}'),
                          trailing: Chip(
                            label: Text(e.status == StatusSync.synced ? 'SYNCED' : 'PENDING'),
                          ),
                          onTap: () => _buka(DetailEntri(id: e.id!)),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
