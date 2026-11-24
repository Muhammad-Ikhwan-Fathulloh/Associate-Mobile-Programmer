import 'package:flutter/material.dart';

import 'data/habit_repository.dart';
import 'logic/streak.dart';
import 'models/habit.dart';

void main() => runApp(const AplikasiKebiasaan());

class AplikasiKebiasaan extends StatelessWidget {
  const AplikasiKebiasaan({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pelacak Kebiasaan',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF1565C0)),
      home: const HalamanKebiasaan(),
    );
  }
}

class HalamanKebiasaan extends StatefulWidget {
  const HalamanKebiasaan({super.key});

  @override
  State<HalamanKebiasaan> createState() => _HalamanKebiasaanState();
}

class _HalamanKebiasaanState extends State<HalamanKebiasaan> {
  final _repo = HabitRepository();
  final _nama = TextEditingController();
  List<Habit> _daftar = [];
  String? _pesan;

  String get _hariIni => tanggalDari(DateTime.now());

  @override
  void initState() {
    super.initState();
    _muat();
  }

  @override
  void dispose() {
    _nama.dispose();
    super.dispose();
  }

  Future<void> _muat() async {
    final daftar = await _repo.ambilKebiasaan();
    if (mounted) setState(() => _daftar = daftar);
  }

  Future<void> _tambah() async {
    final galat = validasiNama(_nama.text);
    if (galat != null) return setState(() => _pesan = galat);
    await _repo.tambah(_nama.text);
    _nama.clear();
    setState(() => _pesan = null);
    await _muat();
  }

  Future<void> _centang(Habit h) async {
    if (h.sudahHari(_hariIni)) {
      await _repo.batalCatat(h.id, _hariIni);
    } else {
      await _repo.catatSelesai(h.id, _hariIni);
    }
    await _muat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pelacak Kebiasaan')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _nama,
                  maxLength: 40,
                  decoration: const InputDecoration(labelText: 'Nama kebiasaan'),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(onPressed: _tambah, child: const Text('Tambah')),
            ],
          ),
          if (_pesan != null) Text(_pesan!, style: const TextStyle(color: Colors.red)),
          if (_daftar.isEmpty) const Padding(padding: EdgeInsets.all(16), child: Text('Belum ada kebiasaan.')),
          for (final h in _daftar)
            Card(
              child: ListTile(
                title: Text(h.nama),
                subtitle: Text('Streak: ${hitungStreak(h.tanggal)} hari'),
                leading: Checkbox(value: h.sudahHari(_hariIni), onChanged: (_) => _centang(h)),
                trailing: TextButton(
                  onPressed: () async {
                    await _repo.hapus(h.id);
                    await _muat();
                  },
                  child: const Text('Hapus'),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
