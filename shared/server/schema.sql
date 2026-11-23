-- Skema MySQL untuk tabel catatan (padanan tabel notes di SQLite pada aplikasi).
CREATE DATABASE IF NOT EXISTS pelatihan_mobile CHARACTER SET utf8mb4;
USE pelatihan_mobile;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,       -- simpan hash (bcrypt/argon2), bukan kata sandi asli
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  latitude DOUBLE NULL,
  longitude DOUBLE NULL,
  updated_at BIGINT NOT NULL,                 -- milidetik sejak epoch, sama dengan di aplikasi
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notes_user_updated (user_id, updated_at)
);
