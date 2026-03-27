// ============================================================
//  db.js  —  YOUR DATABASE CONNECTION
// ============================================================

// "pg" is the official PostgreSQL package for Node.js
// It gives us the tools to talk to our PostgreSQL database
const { Pool } = require('pg');

// dotenv lets us read the .env file
require('dotenv').config();

// ----- WHAT IS A POOL? -----
// A Pool is a collection of database connections kept ready.
// Instead of opening and closing a connection for every query,
// the pool keeps a few connections open and reuses them.
// This makes your app much faster.

const pool = new Pool({
  host:     process.env.DB_HOST,      // Where PostgreSQL is running (usually "localhost")
  port:     process.env.DB_PORT,      // PostgreSQL default port is 5432
  database: process.env.DB_NAME,      // The name of your database (e.g. "tirelo_classes")
  user:     process.env.DB_USER,      // Your PostgreSQL username (usually "postgres")
  password: process.env.DB_PASSWORD,  // Your PostgreSQL password
});

// ----- TEST THE CONNECTION -----
// This runs once when the server starts.
// It tries to connect and tells you if it worked or not.
pool.connect((err, client, release) => {
  if (err) {
    // If something went wrong, print the error clearly
    console.error('❌ Could not connect to the database:', err.message);
    console.error('👉 Check your .env file — DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
  } else {
    console.log('✅ Connected to PostgreSQL database successfully!');
    release(); // Release this test connection back to the pool
  }
});

// Export the pool so other files can use it
// When another file does: const db = require('./db')
// They get this pool and can run queries with it
module.exports = pool;
