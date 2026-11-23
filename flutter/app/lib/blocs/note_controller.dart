import 'package:flutter/foundation.dart';

import '../data/note_repository.dart';
import '../models/note.dart';

/// State catatan untuk Hari 1 menggunakan ChangeNotifier.
class NoteController extends ChangeNotifier {
  NoteController({NoteRepository? repository})
      : _repository = repository ?? NoteRepository();

  final NoteRepository _repository;
  List<Note> _notes = const [];
  bool _isLoading = false;
  String? _error;

  List<Note> get notes => _notes;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> load() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _notes = await _repository.ambilSemua();
    } catch (e) {
      _error = 'Gagal memuat catatan: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> tambah(Note note) async {
    await _repository.simpan(note);
    await load();
  }

  Future<void> hapus(int id) async {
    await _repository.hapus(id);
    await load();
  }
}
