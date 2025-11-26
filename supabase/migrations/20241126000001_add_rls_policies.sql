-- RLS Policies for authenticated users
-- Note: For now, we'll allow authenticated users to perform all operations
-- In production, these should be refined based on actual user roles

-- Meetings: Allow read for all authenticated users, write for service role
CREATE POLICY "Allow read access to meetings for authenticated users"
  ON meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to meetings for service role"
  ON meetings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow update access to meetings for service role"
  ON meetings FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Allow delete access to meetings for service role"
  ON meetings FOR DELETE
  TO service_role
  USING (true);

-- Administrators: Service role only for all operations
CREATE POLICY "Allow all access to administrators for service role"
  ON administrators FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Leaders: Read for authenticated, all for service role
CREATE POLICY "Allow read access to leaders for authenticated users"
  ON leaders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all access to leaders for service role"
  ON leaders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Participants: Allow all operations for authenticated users (will be refined later)
CREATE POLICY "Allow all access to participants for authenticated users"
  ON participants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to participants for service role"
  ON participants FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix function search_path issue
ALTER FUNCTION update_updated_at_column() SET search_path = pg_catalog, public;
