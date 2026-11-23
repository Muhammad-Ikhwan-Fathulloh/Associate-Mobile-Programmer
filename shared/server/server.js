const { buatApp, PENGGUNA } = require('./app');

const PORT = process.env.PORT || 3000;
buatApp().listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Akun uji: ${PENGGUNA.email} / ${PENGGUNA.password}`);
  console.log('Emulator Android memakai http://10.0.2.2:' + PORT + ' untuk menjangkau komputer ini.');
});
