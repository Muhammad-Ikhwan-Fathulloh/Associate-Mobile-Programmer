import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../blocs/note_controller.dart';
import '../models/note.dart';
import '../services/distance.dart';
import '../services/location_service.dart';

class NotesPage extends StatefulWidget {
  const NotesPage({super.key});

  @override
  State<NotesPage> createState() => _NotesPageState();
}

class _NotesPageState extends State<NotesPage> {
  final _controller = NoteController();
  final _location = LocationService();
  Position? _posisi;

  @override
  void initState() {
    super.initState();
    _controller.load();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _perbaruiPosisi() async {
    try {
      final posisi = await _location.ambilPosisi();
      if (!mounted) return;
      setState(() => _posisi = posisi);
    } on LocationException catch (e) {
      _tampilkanPesan(e.pesan);
    } catch (e) {
      _tampilkanPesan('Gagal mengambil posisi: $e');
    }
  }

  void _tampilkanPesan(String pesan) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(pesan)));
  }

  Future<void> _tambahCatatan() async {
    final catatan = await context.push<Note>('/catatan/baru');
    if (catatan == null || !mounted) return;
    await _controller.tambah(catatan);
  }

  String _keterangan(Note note) {
    final baris = <String>[note.content];
    final lat = note.latitude;
    final lon = note.longitude;

    if (lat != null && lon != null) {
      baris.add('Koordinat: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}');
      final posisi = _posisi;
      if (posisi != null) {
        final meter = jarakMeter(posisi.latitude, posisi.longitude, lat, lon);
        baris.add('Jarak: ${_formatJarak(meter)}');
      }
    }
    return baris.join('\n');
  }

  String _formatJarak(double meter) {
    return meter < 1000
        ? '${meter.round()} m'
        : '${(meter / 1000).toStringAsFixed(2)} km';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catatan Lokal'),
        actions: [
          IconButton(
            tooltip: 'Perbarui posisi saya',
            icon: const Icon(Icons.my_location),
            onPressed: _perbaruiPosisi,
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: _controller,
        builder: (context, _) {
          if (_controller.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (_controller.error != null) {
            return Center(child: Text(_controller.error!));
          }
          if (_controller.notes.isEmpty) {
            return const Center(
              child: Text('Belum ada catatan. Tekan tombol + untuk menambah.'),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _controller.notes.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final note = _controller.notes[index];
              return Card(
                child: ListTile(
                  title: Text(note.title),
                  subtitle: Text(_keterangan(note)),
                  trailing: IconButton(
                    tooltip: 'Hapus',
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () => _controller.hapus(note.id!),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Tambah catatan',
        onPressed: _tambahCatatan,
        child: const Icon(Icons.add),
      ),
    );
  }
}
