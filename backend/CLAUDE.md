# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Guardian is a NestJS REST API backend for managing an after-school activities program — students, teachers, activities, payments, attendance, and parent agreements.

## Commands

```bash
npm run start:dev   # Start with hot-reload (development)
npm run build       # Compile TypeScript → dist/
npm run start:prod  # Run compiled dist/ (production)
npm run typeorm     # TypeORM CLI (migrations, schema)
```

No test framework is currently configured. To add Jest:
```bash
npm install --save-dev @nestjs/testing jest ts-jest @types/jest
```

## Environment Variables

Create a `.env` file in the project root:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=guardian_db
PORT=3001
```

TypeORM is configured with `synchronize: true`, so the schema auto-updates from entity definitions — no manual migrations needed in development.

## Architecture

**Entry point:** `src/main.ts`
- Global API prefix: `/api`
- CORS allowed origins: `localhost:3000`, `5173`, `4173`
- Global `ValidationPipe` (uses `class-validator` DTOs)
- Default port: `3001`

**Pattern:** Each feature module follows a strict Controller → Service → Entity structure with DTOs for validation. All modules are registered in `src/app.module.ts`.

| Module | Key Entity Fields |
|---|---|
| `teachers` | firstName, lastName, email, phone, specialization |
| `activities` | name, time, dayOfWeek, description, capacity |
| `students` | firstName, lastName, dateOfBirth, guardian*, address, enrollmentDate |
| `attendance` | studentId, activityId, date, status (PRESENT/ABSENT/EXCUSED) |
| `payments` | studentId, amount, date, method (CASH/CARD/TRANSFER), status (PAID/PENDING/OVERDUE) |
| `agreements` | studentId, agreementDate, startDate, endDate, terms, status |
| `dashboard` | Read-only analytics; queries other module services for stats and alerts |

**Relationships:**
- Activity ↔ Teacher: many-to-many via `activity_teachers` join table
- Activity ↔ Student: many-to-many via `activity_students` join table
- Student → AttendanceRecord, Payment, Agreement: one-to-many

**Seeding:** `src/seed/seed.service.ts` implements `OnApplicationBootstrap` and auto-populates the DB on first run (skips if data already exists). Contains 3 teachers, 4 students, 3 activities, and related records.

## Database

PostgreSQL with TypeORM. All tables use UUID primary keys, `createdAt`/`updatedAt` timestamps, and enum types for status fields. The schema reference is in `schema.sql` at the repo root.
