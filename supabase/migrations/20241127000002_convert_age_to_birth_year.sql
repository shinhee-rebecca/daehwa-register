-- Convert age from years old to birth year
-- Example: age 28 -> birth year 1996 (assuming current year is 2024)
-- For ages stored as two-digit birth years (50+), they are already correct

UPDATE participants
SET age = CASE
  -- If age is less than 150, assume it's actual age in years, convert to birth year
  WHEN age < 150 THEN 2024 - age
  -- If age is 150 or more, it's likely already a year, keep as is
  ELSE age
END
WHERE age < 1900;

-- Add a comment to the column
COMMENT ON COLUMN participants.age IS '출생 년도 (Birth Year, e.g., 1996, 2003)';
