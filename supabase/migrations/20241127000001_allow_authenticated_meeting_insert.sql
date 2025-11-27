-- Allow authenticated users to insert, update, delete meetings
-- This is needed for the Excel import feature where admins can auto-create meetings

-- Drop the existing service_role only policies
DROP POLICY IF EXISTS "Allow insert access to meetings for service role" ON meetings;
DROP POLICY IF EXISTS "Allow update access to meetings for service role" ON meetings;
DROP POLICY IF EXISTS "Allow delete access to meetings for service role" ON meetings;

-- Create new policies that allow authenticated users to insert, update, delete meetings
CREATE POLICY "Allow insert access to meetings for authenticated users"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to meetings for authenticated users"
  ON meetings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow delete access to meetings for authenticated users"
  ON meetings FOR DELETE
  TO authenticated
  USING (true);

-- Also keep service_role access
CREATE POLICY "Allow all access to meetings for service role"
  ON meetings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
