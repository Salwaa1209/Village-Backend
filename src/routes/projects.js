const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middlewares/authJwt');

router.post('/', auth, async (req,res)=>{
  try{
    const { title, description, location, estimated_budget, status } = req.body;
    const q = `INSERT INTO projects (title,description,location,estimated_budget,status,created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const { rows } = await pool.query(q,[title,description,location,estimated_budget,status||'draft', req.user.id]);
    res.status(201).json(rows[0]);
  }catch(err){ res.status(500).json({message:err.message}); }
});

router.get('/', auth, async (req,res)=>{
  try{
    const { status } = req.query;
    let q = 'SELECT * FROM projects';
    const params = [];
    if (status){ q += ' WHERE status=$1'; params.push(status); }
    const { rows } = await pool.query(q, params);
    res.json(rows);
  }catch(err){ res.status(500).json({message:err.message}); }
});

router.put('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    const { title, description, location, estimated_budget, status, priority } = req.body;
    const q = `UPDATE projects SET title=$1, description=$2, location=$3, estimated_budget=$4, status=$5, priority=$6, updated_at=now() WHERE id=$7 RETURNING *`;
    const { rows } = await pool.query(q,[title,description,location,estimated_budget,status,priority,id]);
    res.json(rows[0]);
  }catch(err){ res.status(500).json({message:err.message}); }
});

module.exports = router;
