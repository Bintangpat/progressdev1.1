Berikut adalah **Product Requirements Document (PRD)** untuk webapp monitoring progress proyek developer berbasis **Next.js + Supabase**.

---

# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

### 1.1 Nama Produk

DevProgress — Web App Monitoring Progress Proyek Klien

### 1.2 Tujuan Produk

Menyediakan platform transparan untuk:

- Developer mempublikasikan progres proyek ke klien
- Klien memonitor perkembangan secara real-time
- Mengurangi miskomunikasi dan meningkatkan trust

### 1.3 Target User

1. Developer (freelancer / agency kecil)
2. Pemangku Kepentingan (client / stakeholder)

---

## 2. Goals & Success Metrics

### 2.1 Goals

- Developer dapat membuat dan mengelola proyek
- Developer dapat membagikan link publik ke stakeholder
- Stakeholder dapat melihat progress tanpa login
- Stakeholder dapat memberi komentar
- Stakeholder dapat menghubungi developer via WhatsApp

### 2.2 Success Metrics

- 90% proyek memiliki minimal 1 update task
- 70% stakeholder membuka link progress minimal 2 kali
- <5% complaint terkait kurangnya transparansi progress

---

## 3. User Flow

## 3.1 Developer Flow

1. Developer login
2. Masuk dashboard
3. Create Project:
   - Nama Pemangku Kepentingan
   - Nama Platform
   - Durasi Proyek

4. Sistem generate public link unik
5. Developer membuat task dengan:
   - Judul task
   - Deskripsi
   - Checklist
   - Screenshot

6. Developer checklist item
7. Status proyek berubah otomatis (On Progress → Completed)
8. Proyek selesai

---

## 3.2 Stakeholder Flow

1. Mendapatkan link unik
2. Membuka halaman project (tanpa login)
3. Melihat:
   - Progress bar
   - List task
   - Screenshot

4. Memberikan komentar
5. Klik tombol “Hubungi Developer via WhatsApp”

---

# 4. Functional Requirements

---

## 4.1 Authentication (Developer Only)

### Role:

- Developer

### Fitur:

- Login dengan email/password
- Supabase Auth digunakan

Referensi: Supabase menyediakan authentication berbasis PostgreSQL + JWT.

---

## 4.2 Dashboard Developer

### Route:

`/dashboard`

### Fitur:

- List semua proyek
- Create project
- Edit project
- Delete project
- Copy public link

---

## 4.3 Create Project

### Field:

- stakeholder_name (string)
- platform_name (string)
- project_duration (date range)
- developer_whatsapp (string)
- project_status (enum: draft, active, completed)

### Auto Generate:

- public_slug (uuid)

Public URL format:

```
/project/{public_slug}
```

---

## 4.4 Task Management

### Route:

`/dashboard/project/{id}`

### Fitur:

- Create task
- Upload screenshot
- Add checklist
- Mark checklist done
- Edit task
- Delete task

### Task Status Logic

Task dianggap selesai jika semua checklist true.

### Project Completion Logic

Project selesai jika semua task selesai.

---

## 4.5 Public Project Page

### Route:

`/project/{public_slug}`

### Tidak perlu login

### Tampilkan:

- Nama platform
- Nama stakeholder
- Durasi proyek
- Progress bar (%)
- List task
- Screenshot preview
- Checklist status

---

## 4.6 Comment System

Stakeholder dapat:

- Menulis komentar
- Reply komentar
- Timestamp otomatis

Komentar langsung tersimpan di Supabase.

---

## 4.7 WhatsApp Direct Contact

Button:

```
Hubungi Developer
```

Format link:

```
https://wa.me/{nomor}?text=Halo terkait project {platform_name}
```

Referensi resmi WhatsApp Click to Chat:
WhatsApp menyediakan format wa.me untuk direct messaging.

---

# 5. Non-Functional Requirements

### 5.1 Performance

- Halaman publik load < 2 detik
- Optimized image upload

### 5.2 Security

- Row Level Security (RLS) Supabase
- Public page read-only
- Developer hanya bisa akses project miliknya

### 5.3 Scalability

- Hosted via Vercel
- Backend via Supabase

---

# 6. Technical Architecture

## 6.1 Frontend

Framework:
Next.js

Mode:

- App Router
- Server Components
- ISR untuk halaman publik

---

## 6.2 Backend

Database:

- PostgreSQL (Supabase)

Storage:

- Supabase Storage untuk screenshot

Auth:

- Supabase Auth

---

# 7. Role & Permission Matrix

| Action           | Developer | Stakeholder |
| ---------------- | --------- | ----------- |
| Login            | Yes       | No          |
| Create Project   | Yes       | No          |
| Edit Project     | Yes       | No          |
| View Public Page | Yes       | Yes         |
| Comment          | Yes       | Yes         |
| Checklist Update | Yes       | No          |

---

# 8. UI Pages Required

Developer:

- Login
- Dashboard
- Create Project
- Project Detail
- Task Editor

Stakeholder:

- Public Project Page

---

# 9. Future Enhancements

- Multi Developer Team
- Notifikasi email ke stakeholder
- File attachment selain screenshot
- Timeline view (Gantt)
- Progress analytics
- Export PDF report

---

# 10. Risk Assessment

| Risk                  | Mitigation           |
| --------------------- | -------------------- |
| Screenshot besar      | Batasi ukuran upload |
| Link dibagikan publik | Gunakan UUID random  |
| Spam komentar         | Rate limiting        |

---

# 11. MVP Scope

Include:

- Auth
- Create project
- Task + checklist
- Screenshot
- Public link
- Comment
- WhatsApp button

Exclude:

- Multi role complex
- Payment system
- Advanced analytics

Saran Tambahan (Minor Tweaks)
Agar aplikasi ini lebih solid dan profesional, pertimbangkan beberapa hal berikut:

1. Penanganan Status "Public Page"
   Karena stakeholder tidak login, mereka tidak punya profil di sistem kamu.

Saran: Pada fitur komentar (4.6), tambahkan input "Nama Anda" sebelum mereka bisa kirim komentar. Simpan nama ini di localStorage agar mereka tidak perlu mengetik ulang saat berkomentar lagi di task lain.

2. Logika Progress Bar
   Di poin 4.5 disebutkan ada progress bar. Kamu perlu menentukan rumusnya secara eksplisit di PRD agar konsisten saat coding.

Saran: Apakah progress dihitung dari jumlah_task_selesai / total_task atau jumlah_checklist_selesai / total_checklist? Biasanya, menghitung berdasarkan checklist jauh lebih akurat untuk memvisualisasikan progres kecil.

3. Keamanan Data (Supabase RLS)
   Karena halaman publik bisa diakses tanpa login, kamu harus sangat berhati-hati dengan Row Level Security.

Saran: Pastikan tabel projects memiliki kebijakan:

SELECT: Bisa diakses jika public_slug cocok (untuk publik).

ALL: Hanya jika auth.uid() == user_id (untuk developer).

Sembunyikan kolom sensitif (jika ada) di level API.

4. UX: Copy Link
   Di Dashboard Developer, fitur "Copy Public Link" sangat penting.

Saran: Tambahkan integrasi navigator.clipboard agar developer tinggal klik satu tombol untuk membagikan progress ke WhatsApp klien.
