const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middlewares/authJwt');

router.post('/', auth, async (req,res)=>{
  try {
    const { project_id, message, metadata } = req.body;
    const q = `INSERT INTO feedbacks (project_id, author_id, message, metadata) VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await pool.query(q,[project_id, req.user.id, message, metadata||{}]);
    res.status(201).json(rows[0]);
  } catch(err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
