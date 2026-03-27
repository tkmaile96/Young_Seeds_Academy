// ============================================================
//  routes/contacts.js  —  CONTACT MESSAGE ROUTES
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');


// ============================================================
//  ROUTE 1: POST /api/contacts
//  Purpose: Save a new contact message
// ============================================================

router.post('/', async (req, res) => {

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Please provide your name, email and a message.'
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );

    res.status(201).json({
      message: 'Message received! Tirelo will get back to you within 24 hours. ✉️',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving contact message:', error.message);
    res.status(500).json({ error: 'Could not save your message. Please try again.' });
  }
});


// ============================================================
//  ROUTE 2: GET /api/contacts
//  Purpose: Fetch all contact messages (for Tirelo to read)
// ============================================================

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      // We also select unread messages first (is_read = false comes before true)
      'SELECT * FROM contacts ORDER BY is_read ASC, sent_at DESC'
    );

    res.status(200).json({
      total:  result.rows.length,
      unread: result.rows.filter(m => !m.is_read).length,
      data:   result.rows
    });

  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Could not fetch messages.' });
  }
});


// ============================================================
//  ROUTE 3: PUT /api/contacts/:id/read
//  Purpose: Mark a message as read once you've seen it
// ============================================================

router.put('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE contacts SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No message found with id ${id}` });
    }

    res.status(200).json({
      message: 'Message marked as read.',
      data:    result.rows[0]
    });

  } catch (error) {
    console.error('Error updating message:', error.message);
    res.status(500).json({ error: 'Could not update message.' });
  }
});


// ============================================================
//  ROUTE 4: DELETE /api/contacts/:id
//  Purpose: Delete a message you no longer need
// ============================================================

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No message found with id ${id}` });
    }

    res.status(200).json({ message: `Message from ${result.rows[0].name} deleted.` });

  } catch (error) {
    console.error('Error deleting message:', error.message);
    res.status(500).json({ error: 'Could not delete message.' });
  }
});


module.exports = router;
