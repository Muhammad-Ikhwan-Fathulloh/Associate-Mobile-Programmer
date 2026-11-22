import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/post.dart';

class PostFormPage extends StatefulWidget {
  const PostFormPage({super.key});

  @override
  State<PostFormPage> createState() => _PostFormPageState();
}

class _PostFormPageState extends State<PostFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _judul = TextEditingController();
  final _isi = TextEditingController();

  @override
  void dispose() {
    _judul.dispose();
    _isi.dispose();
    super.dispose();
  }

  void _simpan() {
    if (!_formKey.currentState!.validate()) return;

    // id 0 menandakan post belum tersimpan; ID final berasal dari server.
    context.pop(
      Post(id: 0, judul: _judul.text.trim(), isi: _isi.text.trim()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Post Baru')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _judul,
              decoration: const InputDecoration(
                labelText: 'Judul',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().length < 3)
                  ? 'Judul minimal 3 karakter'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _isi,
              maxLines: 5,
              decoration: const InputDecoration(
                labelText: 'Isi',
                border: OutlineInputBorder(),
              ),
              validator: (value) => (value == null || value.trim().isEmpty)
                  ? 'Isi tidak boleh kosong'
                  : null,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _simpan,
              child: const Text('Kirim'),
            ),
          ],
        ),
      ),
    );
  }
}
