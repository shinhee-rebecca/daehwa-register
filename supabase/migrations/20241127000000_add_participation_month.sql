-- Add participation_month column to participants table
ALTER TABLE participants ADD COLUMN participation_month TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_participation_month ON participants(participation_month);

-- Add comment to column
COMMENT ON COLUMN participants.participation_month IS 'Participation month in YYMM format (e.g., 2411, 2506)';
