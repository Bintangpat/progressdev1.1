Berikut adalah **Product Requirements Document (PRD)** untuk pengembangan backend **ProgressDev** menggunakan **NestJS** dan **TypeScript**. Dokumen ini dikembangkan berdasarkan skema basis data dan konsep produk yang telah kamu buat sebelumnya untuk proyek **DevProgress**.

---

# PRD: Backend ProgressDev (Tracking Progress Pengembangan)

## 1. Ringkasan Produk

**ProgressDev** adalah API backend yang berfungsi sebagai mesin utama aplikasi monitoring proyek. Sistem ini memungkinkan transparansi antara developer dan stakeholder melalui pembaruan tugas secara real-time, manajemen checklist, dan bukti pengerjaan (screenshot).

## 2. Manajemen Pengguna & Peran (RBAC)

Berbeda dengan skema awal yang hanya berfokus pada Developer, backend ini akan mengimplementasikan tiga peran utama:

| Role            | Deskripsi                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Admin**       | Memiliki akses penuh untuk mengelola seluruh user (Developer & Stakeholder), memantau semua proyek, dan konfigurasi sistem. |
| **Developer**   | User yang membuat proyek, mengelola tugas (task), mengunggah screenshot, dan memperbarui checklist.                         |
| **Stakeholder** | User (klien) yang diberikan akses login untuk memantau proyek spesifik, memberikan komentar, dan melihat riwayat progres.   |

---

## 3. Arsitektur Autentikasi

Sesuai permintaan, sistem menggunakan dua metode autentikasi yang diintegrasikan melalui **Passport.js** di NestJS:

- **Tradisional (Form):** Menggunakan email dan password dengan enkripsi Argon2 atau Bcrypt.
- **Google OAuth 2.0:** Memungkinkan user (terutama Stakeholder/Admin) login menggunakan akun Google.
- **JWT Strategy:** Semua request yang terproteksi wajib menyertakan _Bearer Token_.

---

## 4. Persyaratan Fungsional (Modul Backend)

### 4.1 Modul Proyek (Project Management)

- **Generate Public Link:** Backend harus menggenerasi `public_slug` unik (UUID/Hex) agar proyek bisa diakses secara publik jika diizinkan.
- **Progress Calculation:** Logika perhitungan progres otomatis berdasarkan jumlah checklist yang diselesaikan.

$$\text{Progress} = \left( \frac{\sum \text{Checklist yang dicentang}}{\sum \text{Total Checklist}} \right) \times 100\%$$

### 4.2 Modul Tugas & Bukti (Tasks & Screenshots)

- **Task CRUD:** Manajemen judul, deskripsi, dan urutan (_order_index_).
- **File Upload:** Integrasi dengan Cloud Storage (seperti Supabase Storage atau AWS S3) untuk menyimpan screenshot pengerjaan.

### 4.3 Modul Interaksi (Comments & WhatsApp)

- **Hierarchical Comments:** Mendukung fitur balas pesan (_reply_) antar developer dan stakeholder.
- **WhatsApp Integration:** API menyediakan endpoint untuk mengambil link WhatsApp yang sudah terformat dengan pesan otomatis.

---

## 5. Rancangan API (Endpoints)

### Auth & User

- `POST /auth/register` - Registrasi form tradisional.
- `POST /auth/login` - Login form tradisional (menghasilkan JWT).
- `GET /auth/google` - Redirect ke Google Sign-In.
- `GET /auth/google/callback` - Callback untuk memproses data user dari Google.

### Projects

- `GET /projects` - List proyek (Admin: semua, Developer: miliknya, Stakeholder: proyek terkait).
- `POST /projects` - Membuat proyek baru (Developer/Admin).
- `GET /projects/:slug/public` - Akses publik tanpa token (Read-only).

### Tasks & Checklists

- `PATCH /tasks/:id/status` - Update status tugas.
- `POST /tasks/:id/checklist` - Menambah item checklist.
- `POST /tasks/:id/screenshot` - Upload gambar bukti pengerjaan.

---

## 6. Struktur Basis Data (Peningkatan)

Berdasarkan skema awal, tabel `profiles` perlu ditambahkan kolom `role` untuk mendukung RBAC:

```sql
CREATE TYPE user_role AS ENUM ('admin', 'developer', 'stakeholder');

ALTER TABLE profiles
ADD COLUMN role user_role DEFAULT 'developer';

```

---

## 7. Persyaratan Non-Fungsional

- **Security:** Implementasi **Row Level Security (RLS)** atau Guard di NestJS untuk memastikan Developer tidak bisa mengedit proyek milik orang lain.
- **Validation:** Menggunakan `class-validator` dan `class-transformer` untuk validasi DTO (_Data Transfer Object_).
- **Logging:** Pencatatan aktivitas krusial (seperti penghapusan proyek) menggunakan logger bawaan NestJS.

---

## 8. Rencana Implementasi

1. **Phase 1:** Setup Boilerplate NestJS, TypeORM/Prisma, dan integrasi Database supabase.
2. **Phase 2:** Implementasi Passport JWT dan Google OAuth.
3. **Phase 3:** Pengembangan CRUD Proyek dan Task dengan logika perhitungan progres.
4. **Phase 4:** Integrasi File Upload untuk screenshot.
5. **Phase 5:** Testing menggunakan Jest (Unit Test) dan Swagger (API Documentation).
