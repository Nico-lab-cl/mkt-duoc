import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable',
  ssl: false
});

try {
  // Count first
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM leads WHERE first_name LIKE 'TestName%' OR email LIKE 'test_user_%@test.com'"
  );
  console.log('Registros de stress test encontrados:', countResult.rows[0].count);

  // Delete them
  const deleteResult = await pool.query(
    "DELETE FROM leads WHERE first_name LIKE 'TestName%' OR email LIKE 'test_user_%@test.com'"
  );
  console.log('Registros eliminados:', deleteResult.rowCount);

  // Show remaining
  const remaining = await pool.query("SELECT COUNT(*) FROM leads");
  console.log('Registros restantes en leads:', remaining.rows[0].count);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await pool.end();
}
