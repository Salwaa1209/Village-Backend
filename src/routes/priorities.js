const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middlewares/authJwt');

router.post('/', auth, async (req,res)=>{
  const { priorities } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of priorities) {
      await client.query(`INSERT INTO priorities (project_id, rank, created_by) VALUES ($1,$2,$3) ON CONFLICT (project_id) DO UPDATE SET rank = EXCLUDED.rank`, [p.project_id, p.rank, req.user.id]);
      await client.query(`UPDATE projects SET priority=$1 WHERE id=$2`, [p.rank, p.project_id]);
    }
    await client.query('COMMIT');
    res.json({ message: 'Priorities saved' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally { client.release(); }
});

module.exports = router;
