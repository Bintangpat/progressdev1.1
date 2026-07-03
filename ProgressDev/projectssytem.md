Oke, jadi ini kombinasinya:
- `userId` di `Project` = stakeholder **utama/pemilik** project (sudah ada, tetap dipakai).
- Perlu tabel baru untuk stakeholder **tambahan** yang ikut diberi akses ke project yang sama (many-to-many), terpisah total dari `ProjectTeamMember`.

## 1. Tambah tabel `ProjectStakeholder`

```prisma
model ProjectStakeholder {
  id        String   @id @default(uuid()) @db.Uuid
  projectId String   @map("project_id") @db.Uuid
  profileId String   @map("profile_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@unique([projectId, profileId]) // cegah duplikat akses
  @@index([profileId])
  @@index([projectId])
  @@map("project_stakeholders")
}
```

## 2. Tambahkan relasi baliknya di `Project` dan `Profile`

```prisma
model Project {
  // ...field yang sudah ada
  stakeholders ProjectStakeholder[]
}
```

```prisma
model Profile {
  // ...field yang sudah ada
  stakeholderAccess ProjectStakeholder[]
}
```

## 3. Migrasi

```bash
npx prisma migrate dev --name add_project_stakeholder
```

## 4. Logika akses (application layer)

Karena pemilik utama ada di `userId` **dan** stakeholder tambahan ada di tabel baru, cek akses harus mencakup keduanya:

```ts
async function getProjectsForStakeholder(profileId: string) {
  return prisma.project.findMany({
    where: {
      OR: [
        { userId: profileId },                          // pemilik utama
        { stakeholders: { some: { profileId } } },       // stakeholder tambahan
      ],
    },
  });
}

async function getProjectForStakeholder(projectId: string, profileId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: profileId },
        { stakeholders: { some: { profileId } } },
      ],
    },
  });

  if (!project) throw new Error("Not found or not authorized");
  return project;
}
```

Gabungkan dengan logika role kamu sebelumnya (admin lihat semua, developer lihat via `ProjectTeamMember`, stakeholder lihat via `userId` + `ProjectStakeholder`) jadi satu fungsi terpusat, misalnya `getProjectsForCurrentUser(profile)`, supaya tidak ada endpoint yang lupa filter.

## 5. Saat admin menambahkan stakeholder ke project

```ts
async function addStakeholderToProject(projectId: string, profileId: string) {
  return prisma.projectStakeholder.create({
    data: { projectId, profileId },
  });
}
```

Prisma otomatis melempar error kalau kombinasi `projectId + profileId` sudah ada (karena `@@unique`), jadi aman dari duplikat.

## Ringkasan pemisahan tabelnya

| Tabel | Untuk siapa | Relasi |
|---|---|---|
| `Project.userId` | Stakeholder pemilik utama | 1 project → 1 profile |
| `ProjectStakeholder` (baru) | Stakeholder tambahan (klien lain yang ikut lihat) | many-to-many |
| `ProjectTeamMember` | Tim internal (developer/admin) | many-to-many |

Ini menjaga stakeholder tetap terpisah total dari tabel tim internal, sesuai yang kamu mau, sambil tetap mendukung satu project dilihat banyak stakeholder.

Mau saya bantu sekalian tunjukkan contoh endpoint API (Next.js route handler / tRPC) yang menggabungkan pengecekan role admin, developer, dan stakeholder jadi satu middleware?
