import pg from 'pg';

const pool = new pg.Pool({
  connectionString: "postgresql://neondb_owner:npg_hjB8JqOYw0Qf@ep-aged-dawn-ai1utjuz-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
  ssl: {
    rejectUnauthorized: true
  }
});

export default pool;
