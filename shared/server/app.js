// API catatan untuk pelatihan. Data disimpan di memori agar mudah dijalankan.
// Untuk MySQL, lihat schema.sql dan docs/mysql-dan-api.md.
const express = require('express');
const crypto = require('crypto');

const PENGGUNA = { email: 'peserta@contoh.id', password: 'rahasia123' };

function buatApp() {
  const app = express();
  app.use(express.json());

  const tokens = new Set();
  let catatan = [];
  let idBerikut = 1;

  // CORS longgar untuk uji lokal (peramban). Jangan dipakai apa adanya di produksi.
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  const wajibLogin = (req, res, next) => {
    const h = req.get('Authorization') || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : '';
    if (!tokens.has(token)) return res.status(401).json({ error: 'Token tidak valid atau belum login.' });
    next();
  };

  const validasi = (b) => {
    if (!b || typeof b.title !== 'string' || b.title.trim() === '') return 'Judul wajib diisi.';
    if (b.title.trim().length > 100) return 'Judul maksimal 100 karakter.';
    if (typeof b.content !== 'string') return 'Isi wajib berupa teks.';
    return null;
  };

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    if (email !== PENGGUNA.email || password !== PENGGUNA.password) {
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }
    const token = crypto.randomBytes(16).toString('hex');
    tokens.add(token);
    res.json({ token });
  });

  app.get('/notes', wajibLogin, (req, res) => res.json(catatan));

  app.post('/notes', wajibLogin, (req, res) => {
    const pesan = validasi(req.body);
    if (pesan) return res.status(400).json({ error: pesan });
    const { title, content, latitude = null, longitude = null } = req.body;
    const baru = { id: idBerikut++, title: title.trim(), content, latitude, longitude, updatedAt: Date.now() };
    catatan.push(baru);
    res.status(201).json(baru);
  });

  app.put('/notes/:id', wajibLogin, (req, res) => {
    const n = catatan.find((x) => x.id === Number(req.params.id));
    if (!n) return res.status(404).json({ error: 'Catatan tidak ditemukan.' });
    const pesan = validasi(req.body);
    if (pesan) return res.status(400).json({ error: pesan });
    Object.assign(n, {
      title: req.body.title.trim(),
      content: req.body.content,
      latitude: req.body.latitude ?? null,
      longitude: req.body.longitude ?? null,
      updatedAt: Date.now(),
    });
    res.json(n);
  });

  app.delete('/notes/:id', wajibLogin, (req, res) => {
    const sebelum = catatan.length;
    catatan = catatan.filter((x) => x.id !== Number(req.params.id));
    if (catatan.length === sebelum) return res.status(404).json({ error: 'Catatan tidak ditemukan.' });
    res.sendStatus(204);
  });

  return app;
}

module.exports = { buatApp, PENGGUNA };
