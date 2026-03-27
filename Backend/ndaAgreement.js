// routes/nda-agreements.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// POST /api/nda-agreements - Save a signed agreement
router.post('/', async (req, res) => {
  const { 
    parent_name, 
    learner_name, 
    grade, 
    signature, 
    signed_at, 
    registration_id,
    registration_data 
  } = req.body;

  // Validation
  if (!parent_name || !learner_name || !grade || !signature || !signed_at) {
    return res.status(400).json({
      error: 'Parent name, learner name, grade, signature, and signed date are required.'
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO nda_agreements 
        (parent_name, learner_name, grade, signature, signed_at, registration_id, registration_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [parent_name, learner_name, grade, signature, signed_at, registration_id || null, registration_data || null]
    );

    res.status(201).json({
      message: '✅ Agreement signed successfully! Welcome to Young Seeds Academy.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving NDA agreement:', error.message);
    res.status(500).json({ error: 'Could not save agreement. Please try again.' });
  }
});

// GET /api/nda-agreements - Fetch all signed agreements (for admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, r.first_name, r.last_name, r.email 
       FROM nda_agreements a
       LEFT JOIN registrations r ON a.registration_id = r.id
       ORDER BY a.signed_at DESC`
    );

    res.status(200).json({
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching NDA agreements:', error.message);
    res.status(500).json({ error: 'Could not fetch agreements.' });
  }
});

// GET /api/nda-agreements/learner/:name - Fetch agreements for a specific learner
router.get('/learner/:name', async (req, res) => {
  const { name } = req.params;
  
  try {
    const result = await db.query(
      'SELECT * FROM nda_agreements WHERE learner_name ILIKE $1 ORDER BY signed_at DESC',
      [`%${name}%`]
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching learner agreements:', error.message);
    res.status(500).json({ error: 'Could not fetch agreements.' });
  }
});

module.exports = router;