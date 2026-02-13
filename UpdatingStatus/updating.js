import pool from './Database/db.js';

const waitOneMinute = () =>
  new Promise(resolve => setTimeout(resolve, 60000));

export const updateUsers = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //  Finish existing ONGOING
    const ongoing = await client.query(
      "SELECT id FROM tokens WHERE status = 'ONGOING' FOR UPDATE"
    );

    if (ongoing.rows.length > 0) {
      await client.query(
        "UPDATE tokens SET status = 'COMPLETED' WHERE id = $1",
        [ongoing.rows[0].id]
      );
      await client.query('COMMIT');
      console.log('ONGOING → COMPLETED');
      return;
    }

    //  Pick next WAITING
    const waiting = await client.query(
      "SELECT id, token_number FROM tokens WHERE status = 'WAITING' ORDER BY id ASC LIMIT 1 FOR UPDATE"
    );

    if (waiting.rows.length === 0) {
      await client.query('COMMIT');
      console.log(' No WAITING tokens');
      return;
    }

    const token = waiting.rows[0];

    //  Set ONGOING (DB guarantees uniqueness)
    await client.query(
      "UPDATE tokens SET status = 'ONGOING' WHERE id = $1",
      [token.id]
    );

    await client.query('COMMIT');

    console.log(` Token ${token.token_number} → ONGOING`);

    //  Process token
    await waitOneMinute();

    await pool.query(
      "UPDATE tokens SET status = 'COMPLETED' WHERE id = $1",
      [token.id]
    );

    console.log(` Token ${token.token_number} → COMPLETED`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(' Transaction failed:', err.message);
  } finally {
    client.release();
  }
};