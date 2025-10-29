const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const priorityRoutes = require('./routes/priorities');
const feedbackRoutes = require('./routes/feedback');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/priorities', priorityRoutes);
app.use('/feedback', feedbackRoutes);

app.get('/', (req,res)=> res.json({status:'ok'}));

module.exports = app;
