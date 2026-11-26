-- Skema untuk PowerSync di Supabase.
-- Jalankan seluruh isi berkas ini di Supabase > SQL Editor, sekali saja.
-- Tabel di sini harus sama dengan skema klien di lib/data/schema.dart.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null default '',
  content text not null default ''
);

alter table public.notes enable row level security;

drop policy if exists "pemilik bisa baca" on public.notes;
drop policy if exists "pemilik bisa tambah" on public.notes;
drop policy if exists "pemilik bisa ubah" on public.notes;
drop policy if exists "pemilik bisa hapus" on public.notes;

create policy "pemilik bisa baca" on public.notes
  for select using (auth.uid() = user_id);
create policy "pemilik bisa tambah" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "pemilik bisa ubah" on public.notes
  for update using (auth.uid() = user_id);
create policy "pemilik bisa hapus" on public.notes
  for delete using (auth.uid() = user_id);

-- Publication dipakai PowerSync untuk membaca perubahan (replikasi).
-- Jika muncul galat "already exists", publication sudah ada: lanjutkan saja,
-- lalu pastikan tabel notes ada di dalamnya:
--   alter publication powersync add table public.notes;
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'powersync') then
    create publication powersync for all tables;
  end if;
end $$;
