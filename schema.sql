-- Guardian After School Activities Management System
-- PostgreSQL Schema
-- Run: psql -U postgres -c "CREATE DATABASE guardian_db;" && psql -U postgres -d guardian_db -f schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TEACHERS
-- ============================================================
CREATE TABLE IF NOT EXISTS teachers (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName"       VARCHAR(100) NOT NULL,
    "lastName"        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(50)  NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(200) NOT NULL,
    time         VARCHAR(50)  NOT NULL,
    day_of_week  VARCHAR(100) NOT NULL,
    description  TEXT,
    capacity     INTEGER,
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName"      VARCHAR(100) NOT NULL,
    "lastName"       VARCHAR(100) NOT NULL,
    date_of_birth    VARCHAR(20)  NOT NULL,
    guardian_name    VARCHAR(200) NOT NULL,
    guardian_phone   VARCHAR(50)  NOT NULL,
    guardian_email   VARCHAR(255) NOT NULL,
    address          TEXT,
    enrollment_date  VARCHAR(20)  NOT NULL,
    "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- JOIN TABLE: Activity <-> Teacher (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_teachers (
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    teacher_id  UUID NOT NULL REFERENCES teachers(id)  ON DELETE CASCADE,
    PRIMARY KEY (activity_id, teacher_id)
);

-- ============================================================
-- JOIN TABLE: Activity <-> Student (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_students (
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES students(id)  ON DELETE CASCADE,
    PRIMARY KEY (activity_id, student_id)
);

-- ============================================================
-- ATTENDANCE RECORDS
-- ============================================================
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'excused');

CREATE TABLE IF NOT EXISTS attendance_records (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id  UUID NOT NULL REFERENCES students(id)   ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    date        VARCHAR(20) NOT NULL,
    status      attendance_status NOT NULL DEFAULT 'present',
    notes       TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_student   ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_activity  ON attendance_records(activity_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date      ON attendance_records(date);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'other');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');

CREATE TABLE IF NOT EXISTS payments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount      NUMERIC(15, 2) NOT NULL,
    date        VARCHAR(20) DEFAULT '',
    method      payment_method NOT NULL DEFAULT 'cash',
    status      payment_status NOT NULL DEFAULT 'pending',
    due_date    VARCHAR(20) NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status  ON payments(status);

-- ============================================================
-- AGREEMENTS
-- ============================================================
CREATE TYPE agreement_status AS ENUM ('active', 'expired', 'pending');

CREATE TABLE IF NOT EXISTS agreements (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    agreement_date VARCHAR(20) NOT NULL,
    start_date     VARCHAR(20) NOT NULL,
    end_date       VARCHAR(20) NOT NULL,
    terms          TEXT        NOT NULL,
    signed_by      VARCHAR(200) NOT NULL,
    status         agreement_status NOT NULL DEFAULT 'pending',
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreements_student ON agreements(student_id);

-- ============================================================
-- TRIGGERS: auto-update updatedAt
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['teachers','activities','students','attendance_records','payments','agreements']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
       CREATE TRIGGER trg_%s_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================================
-- SAMPLE DATA (optional — NestJS seed service handles this)
-- ============================================================
-- Uncomment below to insert sample data manually:

/*
INSERT INTO teachers ("firstName","lastName",email,phone,specialization) VALUES
  ('Sarah','Johnson','sarah.j@guardian.edu','+998901234567','Arts & Crafts'),
  ('Michael','Chen','michael.c@guardian.edu','+998901234568','Sports'),
  ('Emily','Rodriguez','emily.r@guardian.edu','+998901234569','Music');

INSERT INTO students ("firstName","lastName",date_of_birth,guardian_name,guardian_phone,guardian_email,address,enrollment_date) VALUES
  ('Alex','Williams','2015-05-12','Jennifer Williams','+998901111111','j.williams@example.com','Tashkent, Yunusabad District','2024-09-01'),
  ('Emma','Davis','2014-08-22','Robert Davis','+998901111112','r.davis@example.com','Tashkent, Mirabad District','2024-09-01'),
  ('Noah','Martinez','2016-03-15','Maria Martinez','+998901111113','m.martinez@example.com','Tashkent, Shaykhantaur District','2024-09-05'),
  ('Sophia','Anderson','2015-11-30','James Anderson','+998901111114','j.anderson@example.com','Tashkent, Chilanzar District','2024-09-10');
*/
