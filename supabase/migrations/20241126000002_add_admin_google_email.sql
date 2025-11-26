-- Add google_email column to administrators for Google OAuth mapping
ALTER TABLE administrators
ADD COLUMN IF NOT EXISTS google_email TEXT NOT NULL UNIQUE;

CREATE INDEX IF NOT EXISTS idx_administrators_google_email ON administrators(google_email);
