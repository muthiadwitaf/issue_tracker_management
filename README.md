# Issue Tracking Management System

Aplikasi pencatatan & pelacakan issue per project, dengan status, solusi, assignment ke programmer, kategori, evidence, dan activity log.

## Stack

- **Frontend**: Vue 3 + Vite + Vuetify 3 + Pinia + Vue Router
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT (login email + password)

## Setup

### 1. Database

Buat database PostgreSQL kosong, lalu salin `backend/.env.example` ke `backend/.env` dan sesuaikan `DATABASE_URL`, `JWT_SECRET`.

### 2. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Server jalan di `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # sesuaikan VITE_API_URL kalau perlu
npm run dev
```

App jalan di `http://localhost:5173`.

### Login

Setelah seed, semua user contoh punya password `password123` (email lihat di `backend/prisma/seed.js`).

## Struktur Proyek

```
backend/    Express API + Prisma schema & migrations
frontend/   Vue 3 SPA
```
