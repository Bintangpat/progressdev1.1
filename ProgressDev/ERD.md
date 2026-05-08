Berikut adalah **Entity Relationship Diagram (ERD)** untuk sistem WebApp Monitoring Progress Developer menggunakan **Next.js + Supabase (PostgreSQL)**.

Struktur dirancang agar:

- Developer memiliki banyak project
- Project memiliki banyak task
- Task memiliki banyak checklist dan screenshot
- Project memiliki banyak komentar (dengan sistem reply)

---

# 1. Entity List

## 1.1 users

Disediakan oleh Supabase Auth (extendable)

| Field      | Type      | Notes           |
| ---------- | --------- | --------------- |
| id         | uuid (PK) | dari auth.users |
| email      | text      | unique          |
| created_at | timestamp | default now()   |

Relasi:

- 1 user → N projects

---

## 1.2 projects

| Field              | Type      | Notes                      |
| ------------------ | --------- | -------------------------- |
| id                 | uuid (PK) | default uuid_generate_v4() |
| user_id            | uuid (FK) | → users.id                 |
| stakeholder_name   | text      |                            |
| platform_name      | text      |                            |
| duration_start     | date      |                            |
| duration_end       | date      |                            |
| public_slug        | text      | unique                     |
| status             | enum      | draft / active / completed |
| developer_whatsapp | text      |                            |
| created_at         | timestamp | default now()              |

Relasi:

- 1 project → N tasks
- 1 project → N comments

---

## 1.3 tasks

| Field        | Type      | Notes         |
| ------------ | --------- | ------------- |
| id           | uuid (PK) |               |
| project_id   | uuid (FK) | → projects.id |
| title        | text      |               |
| description  | text      |               |
| is_completed | boolean   | derived       |
| created_at   | timestamp |               |

Relasi:

- 1 task → N checklist_items
- 1 task → N task_screenshots

---

## 1.4 checklist_items

| Field      | Type      | Notes         |
| ---------- | --------- | ------------- |
| id         | uuid (PK) |               |
| task_id    | uuid (FK) | → tasks.id    |
| label      | text      |               |
| is_checked | boolean   | default false |

Relasi:

- N checklist_items → 1 task

---

## 1.5 task_screenshots

| Field      | Type      | Notes                |
| ---------- | --------- | -------------------- |
| id         | uuid (PK) |                      |
| task_id    | uuid (FK) | → tasks.id           |
| image_url  | text      | Supabase Storage URL |
| created_at | timestamp |                      |

Relasi:

- N screenshots → 1 task

---

## 1.6 comments

| Field       | Type               | Notes                          |
| ----------- | ------------------ | ------------------------------ |
| id          | uuid (PK)          |                                |
| project_id  | uuid (FK)          | → projects.id                  |
| parent_id   | uuid (FK nullable) | → comments.id (self reference) |
| author_name | text               | stakeholder / dev              |
| message     | text               |                                |
| created_at  | timestamp          |                                |

Relasi:

- 1 project → N comments
- 1 comment → N replies (self join)

---

# 2. Relationship Summary

Cardinality Overview:

users (1) ─────── (N) projects
projects (1) ─────── (N) tasks
tasks (1) ─────── (N) checklist_items
tasks (1) ─────── (N) task_screenshots
projects (1) ─────── (N) comments
comments (1) ─────── (N) comments (reply)

---

# 3. Visual ERD (Text Diagram)

```
users
 └── id (PK)
     │
     │ 1
     ▼
projects
 └── id (PK)
 └── user_id (FK)
     │
     │ 1
     ▼
tasks
 └── id (PK)
 └── project_id (FK)
     │
     ├── 1 → N checklist_items
     └── 1 → N task_screenshots

projects
 └── 1 → N comments
comments
 └── parent_id (self reference)
```

---

# 4. Referential Integrity Rules

ON DELETE behavior yang direkomendasikan:

- projects.user_id → ON DELETE CASCADE
- tasks.project_id → ON DELETE CASCADE
- checklist_items.task_id → ON DELETE CASCADE
- task_screenshots.task_id → ON DELETE CASCADE
- comments.project_id → ON DELETE CASCADE
- comments.parent_id → ON DELETE CASCADE

Artinya:
Jika project dihapus → semua task, checklist, screenshot, dan comment ikut terhapus.

---

# 5. Improvement (Production-Ready SaaS)

Berikut adalah **versi scalable ERD extension** untuk mengubah sistem dari single-developer menjadi **multi-developer SaaS collaborative project tracking**.

Tujuan penambahan tabel ini:

- Mendukung team
- Multiple developer dalam satu project
- Role-based access
- Activity log
- Notification system
- Flexible file attachment
- Audit ready

---

# 1. Conceptual Upgrade

Sebelumnya:

```
1 user → banyak project
```

Menjadi:

```
1 user → banyak team
1 team → banyak project
1 project → banyak member
```

---

# 2. Tambahan Tabel Scalable

---

# 2.1 teams

Menampung entitas organisasi / agency / grup developer

| Field      | Type                 | Notes |
| ---------- | -------------------- | ----- |
| id         | uuid (PK)            |       |
| name       | text                 |       |
| owner_id   | uuid (FK → users.id) |       |
| created_at | timestamp            |       |

Relasi:

- 1 team → N team_members
- 1 team → N projects

---

# 2.2 team_members

Many-to-many antara users dan teams

| Field     | Type                 | Notes                     |
| --------- | -------------------- | ------------------------- |
| id        | uuid (PK)            |                           |
| team_id   | uuid (FK → teams.id) |                           |
| user_id   | uuid (FK → users.id) |                           |
| role      | enum                 | owner / admin / developer |
| joined_at | timestamp            |                           |

Constraint:

- UNIQUE(team_id, user_id)

Relasi:

- 1 team → N members
- 1 user → N teams

---

# 2.3 projects (Updated)

Tambahkan:

| Field   | Type                 |
| ------- | -------------------- |
| team_id | uuid (FK → teams.id) |

Artinya:
Project sekarang milik team, bukan langsung milik user.

---

# 2.4 project_members

Many-to-many antara users dan projects
Digunakan untuk granular permission.

| Field      | Type                    | Notes                          |
| ---------- | ----------------------- | ------------------------------ |
| id         | uuid (PK)               |                                |
| project_id | uuid (FK → projects.id) |                                |
| user_id    | uuid (FK → users.id)    |                                |
| role       | enum                    | manager / contributor / viewer |
| added_at   | timestamp               |                                |

Constraint:

- UNIQUE(project_id, user_id)

---

# 2.5 activity_logs

Audit trail untuk setiap perubahan penting.

| Field      | Type      | Notes                |
| ---------- | --------- | -------------------- |
| id         | uuid (PK) |                      |
| project_id | uuid (FK) |                      |
| user_id    | uuid (FK) |                      |
| action     | text      | e.g., "created_task" |
| metadata   | jsonb     |                      |
| created_at | timestamp |                      |

Contoh metadata:

```
{
  "task_id": "...",
  "title": "Implement Auth"
}
```

Manfaat:

- Transparency
- Debugging
- Legal audit

---

# 2.6 notifications

Sistem notifikasi in-app.

| Field        | Type                 | Notes                |
| ------------ | -------------------- | -------------------- |
| id           | uuid (PK)            |                      |
| user_id      | uuid (FK → users.id) |                      |
| project_id   | uuid (FK nullable)   |                      |
| type         | text                 | comment, task_update |
| reference_id | uuid                 |                      |
| is_read      | boolean              |                      |
| created_at   | timestamp            |                      |

---

# 2.7 file_attachments (Generic Polymorphic)

Untuk menggantikan task_screenshots agar lebih fleksibel.

| Field       | Type                 | Notes          |
| ----------- | -------------------- | -------------- |
| id          | uuid (PK)            |                |
| entity_type | text                 | task / comment |
| entity_id   | uuid                 |                |
| file_url    | text                 |                |
| uploaded_by | uuid (FK → users.id) |                |
| created_at  | timestamp            |                |

Keuntungan:

- Bisa attach file ke task
- Bisa attach file ke comment
- Tidak perlu tabel terpisah

---

# 3. Updated Relationship Overview

```
users
 ├── team_members
 ├── project_members
 ├── activity_logs
 └── notifications

teams
 ├── team_members
 └── projects

projects
 ├── tasks
 ├── comments
 ├── project_members
 ├── activity_logs
 └── notifications

tasks
 ├── checklist_items
 └── file_attachments
```

---

# 4. Access Control Architecture (Scalable)

Level Permission:

### Team Level

- owner
- admin
- developer

### Project Level

- manager
- contributor
- viewer

Dengan kombinasi:

- Team owner otomatis project manager
- Developer hanya akses project yang dia join

---

# 5. Scaling Benefit Analysis

| Feature         | Tanpa Extension | Dengan Extension |
| --------------- | --------------- | ---------------- |
| Multi developer | Tidak           | Ya               |
| Agency mode     | Tidak           | Ya               |
| Audit log       | Tidak           | Ya               |
| Notification    | Tidak           | Ya               |
| File flexible   | Tidak           | Ya               |
| SaaS ready      | Terbatas        | Production-grade |

---

# 6. Data Normalization Status

Struktur ini sudah memenuhi:

- 1NF: atomic field
- 2NF: no partial dependency
- 3NF: no transitive dependency
- Polymorphic attachment terkontrol

---

# 7. Jika Dibuat SaaS (Future Monetization)

Tambahan tabel opsional:

### subscriptions

- team_id
- plan_type
- active_until

### billing_logs

- team_id
- amount
- status

---

# 8. Final Architecture Tier

Tier 1: Freelancer mode (single dev)
Tier 2: Team collaboration
Tier 3: Agency SaaS
Tier 4: Enterprise (audit + permission granular)

---

Jika kamu ingin lanjut secara teknikal, saya bisa buatkan:

1. Full SQL create table (production ready)
2. Supabase RLS policy design
3. Diagram Mermaid ERD
4. Folder architecture Next.js scalable
5. System design explanation (interview-level)

Tentukan level implementasi berikutnya.
