const test = require('node:test');
const assert = require('node:assert');
const { buatApp, PENGGUNA } = require('../app');

async function mulai() {
  const server = buatApp().listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const panggil = async (metode, path, { body, token } = {}) => {
    const res = await fetch(base + path, {
      method: metode,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const teks = await res.text();
    return { status: res.status, data: teks ? JSON.parse(teks) : null };
  };
  return { server, panggil };
}

test('login salah ditolak 401, login benar memberi token', async () => {
  const { server, panggil } = await mulai();
  assert.strictEqual((await panggil('POST', '/login', { body: { email: 'x', password: 'y' } })).status, 401);
  const r = await panggil('POST', '/login', { body: PENGGUNA });
  assert.strictEqual(r.status, 200);
  assert.ok(r.data.token.length >= 16);
  server.close();
});

test('endpoint catatan menolak permintaan tanpa token', async () => {
  const { server, panggil } = await mulai();
  assert.strictEqual((await panggil('GET', '/notes')).status, 401);
  assert.strictEqual((await panggil('GET', '/notes', { token: 'palsu' })).status, 401);
  server.close();
});

test('alur CRUD lengkap', async () => {
  const { server, panggil } = await mulai();
  const { data: { token } } = await panggil('POST', '/login', { body: PENGGUNA });
  const baru = await panggil('POST', '/notes', { token, body: { title: ' Belanja ', content: 'telur', latitude: -6.9, longitude: 107.6 } });
  assert.strictEqual(baru.status, 201);
  assert.strictEqual(baru.data.title, 'Belanja');
  const id = baru.data.id;
  assert.strictEqual((await panggil('GET', '/notes', { token })).data.length, 1);
  const ubah = await panggil('PUT', `/notes/${id}`, { token, body: { title: 'Belanja pasar', content: 'telur, susu' } });
  assert.strictEqual(ubah.status, 200);
  assert.strictEqual(ubah.data.latitude, null);
  assert.strictEqual((await panggil('DELETE', `/notes/${id}`, { token })).status, 204);
  assert.strictEqual((await panggil('DELETE', `/notes/${id}`, { token })).status, 404);
  server.close();
});

test('validasi: judul kosong atau terlalu panjang ditolak 400', async () => {
  const { server, panggil } = await mulai();
  const { data: { token } } = await panggil('POST', '/login', { body: PENGGUNA });
  assert.strictEqual((await panggil('POST', '/notes', { token, body: { title: '  ', content: 'a' } })).status, 400);
  assert.strictEqual((await panggil('POST', '/notes', { token, body: { title: 'a'.repeat(101), content: 'a' } })).status, 400);
  assert.strictEqual((await panggil('PUT', '/notes/999', { token, body: { title: 'a', content: 'b' } })).status, 404);
  server.close();
});
