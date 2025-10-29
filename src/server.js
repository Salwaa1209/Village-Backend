const app = require('./app');
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

// Run SQL migration automatically
(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '001_init.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Database migration done.');
  } catch (err) {
    console.error('Migration error:', err.message);
  }
})();

app.listen(port, () => console.log(`🚀 Backend running on port ${port}`));
