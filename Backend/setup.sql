-- ============================================================
--  setup.sql  —  YOUR DATABASE TABLES
--  Run this file ONCE to create the tables in PostgreSQL.
--
--  HOW TO RUN THIS:
--  1. Open pgAdmin or your terminal
--  2. Connect to your database "tirelo_classes"
--  3. Paste this entire file and run it
--  (In terminal: psql -U postgres -d tirelo_classes -f setup.sql)
-- ===========================================================


-- ----- TABLE 1: REGISTRATIONS -----
-- This stores every student who registers for a class.

-- "IF NOT EXISTS" means: only create the table if it doesn't
-- already exist. Safe to run this file multiple times.

CREATE TABLE IF NOT EXISTS registrations (
  id            SERIAL PRIMARY KEY,
  -- VARCHAR(100) = text, max 100 characters
  -- NOT NULL = this field is REQUIRED. Can't be empty.
  first_name    VARCHAR(100)  NOT NULL,
  last_name     VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  phone         VARCHAR(20),
  grade         VARCHAR(50)   NOT NULL,
  preferred_time VARCHAR(100),
  status        VARCHAR(20)   DEFAULT 'pending',
  registered_at TIMESTAMP     DEFAULT NOW()
);


-- ----- TABLE 2: CONTACTS -----
-- This stores every message sent through your contact form.

CREATE TABLE IF NOT EXISTS contacts (

  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(150),
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      DEFAULT false,
  sent_at    TIMESTAMP    DEFAULT NOW()
);

-- ----- TABLE 3: NDA_AGREEMENTS -----
-- Stores signed service agreements after registration

CREATE TABLE IF NOT EXISTS nda_agreements (
  id                SERIAL PRIMARY KEY,
  parent_name       VARCHAR(255) NOT NULL,
  learner_name      VARCHAR(255) NOT NULL,
  grade             VARCHAR(50)  NOT NULL,
  signature         VARCHAR(255) NOT NULL,  -- Digital signature (typed name)
  signed_at         TIMESTAMP    NOT NULL,
  registration_id   INTEGER REFERENCES registrations(id) ON DELETE SET NULL,
  registration_data JSONB,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups by learner
CREATE INDEX IF NOT EXISTS idx_nda_learner ON nda_agreements(learner_name);
CREATE INDEX IF NOT EXISTS idx_nda_registration ON nda_agreements(registration_id);

-- ----- CONFIRM TABLES WERE CREATED -----
-- This prints the tables so you can see them after running
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
