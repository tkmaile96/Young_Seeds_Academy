// ============================================================
//  routes/registrations.js  —  REGISTRATION ROUTES
//
//  A "route" is a URL path that your server listens to.
//  When your blog form submits, it hits one of these routes.
//
//  WHAT IS REST?
//  REST is a standard way of designing APIs. The idea is:
//  - POST   = CREATE something new  (submit a registration)
//  - GET    = READ / fetch data     (get all registrations)
//  - PUT    = UPDATE something      (confirm a registration)
//  - DELETE = DELETE something      (remove a registration)
// ============================================================

const express = require('express');

// express.Router() creates a mini-app just for these routes.
// It keeps things organised instead of putting everything in server.js
const router = express.Router();

// Bring in our database connection from db.js
const db = require('./db');

// Email notifications (Gmail via SMTP + Nodemailer)
const { sendRegistrationNotifications } = require('./mailer');


// ============================================================
//  ROUTE 1: POST /api/registrations
//  Purpose: Save a new student registration to the database
//  Called when: A student submits the registration form
// ============================================================

router.post('/', async (req, res) => {

  // ----- WHAT IS req.body? -----
  // When your form submits, the data travels in the "body" of the request.
  // Express unpacks it for us (because we added express.json() in server.js)
  // We use "destructuring" to pull out each field neatly

  const { first_name, last_name, email, phone, grade, preferred_time } = req.body;

  // ----- VALIDATION -----
  // Before touching the database, check that required fields exist.
  // Always validate on the backend — never trust the frontend alone.
  if (!first_name || !last_name || !email || !grade) {
    // 400 = "Bad Request" — the client sent incomplete data
    return res.status(400).json({
      error: 'Please provide first_name, last_name, email and grade.'
    });
  }

  // ----- TRY / CATCH -----
  // Database operations can fail (e.g. network issue, duplicate email).
  // try = attempt this. catch = if it fails, handle the error gracefully.
  try {

    // ----- THE SQL QUERY -----
    // This is the actual instruction we send to PostgreSQL.
    //
    // INSERT INTO registrations (...columns...) VALUES (...values...)
    // means: "Add a new row to the registrations table with these values"
    //
    // The $1, $2, $3... are PLACEHOLDERS — never put variables directly
    // into SQL strings! That's called SQL Injection and it's a security risk.
    // The actual values go in the array as the second argument.
    //
    // RETURNING * means: "After inserting, give me back the full row"
    // so we can confirm what was saved.

    const result = await db.query(
      `INSERT INTO registrations 
        (first_name, last_name, email, phone, grade, preferred_time)
       VALUES 
        ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [first_name, last_name, email, phone, grade, preferred_time]
    );

    // result.rows[0] = the newly created registration row
    const newRegistration = result.rows[0];

    // Send email notifications (teacher + student).
    // If email fails (e.g. SMTP not configured), we still keep the registration success.
    try {
      await sendRegistrationNotifications(newRegistration);
    } catch (mailError) {
      console.error('Error sending registration emails:', mailError.message);
    }

    // 201 = "Created" — the standard success code when something new is made
    res.status(201).json({
      message: `Registration successful! Welcome, ${first_name} 🎉`,
      data: newRegistration
    });

  } catch (error) {

    // ----- HANDLE DUPLICATE EMAIL -----
    // PostgreSQL error code '23505' = unique constraint violation
    // This happens if someone tries to register with the same email twice
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'This email is already registered. Please use a different email.'
      });
    }

    // For any other unexpected error, log it and send a generic message
    console.error('Error saving registration:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    // 500 = "Internal Server Error" — something broke on your end
  }
});


// ============================================================
//  ROUTE 2: GET /api/registrations
//  Purpose: Fetch ALL registrations (for YOU as the teacher)
//  Called when: You open your admin dashboard to see students
// ============================================================

router.get('/', async (req, res) => {
  try {

    // SELECT * FROM registrations = "Give me all rows from the table"
    // ORDER BY registered_at DESC = "Newest registrations first"
    const result = await db.query(
      'SELECT * FROM registrations ORDER BY registered_at DESC'
    );

    // result.rows = an array of all registration objects
    res.status(200).json({
      count: result.rows.length,  // How many total registrations
      data:  result.rows          // The actual list
    });

  } catch (error) {
    console.error('Error fetching registrations:', error.message);
    res.status(500).json({ error: 'Could not fetch registrations.' });
  }
});


// ============================================================
//  ROUTE 3: GET /api/registrations/:id
//  Purpose: Fetch ONE specific registration by their ID
//  Example: GET /api/registrations/5  → gets student with id=5
// ============================================================

router.get('/:id', async (req, res) => {

  // req.params.id = the number from the URL e.g. "5"
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM registrations WHERE id = $1',
      [id]
    );

    // If no rows came back, this ID doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No registration found with id ${id}` });
      // 404 = "Not Found"
    }

    res.status(200).json({ data: result.rows[0] });

  } catch (error) {
    console.error('Error fetching registration:', error.message);
    res.status(500).json({ error: 'Could not fetch registration.' });
  }
});


// ============================================================
//  ROUTE 4: PUT /api/registrations/:id/status
//  Purpose: Update a student's status (confirm or cancel them)
//  Example: PUT /api/registrations/5/status
//           with body: { "status": "confirmed" }
// ============================================================

router.put('/:id/status', async (req, res) => {

  const { id }     = req.params;
  const { status } = req.body;

  // Only allow these three valid status values
  const validStatuses = ['pending', 'confirmed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  try {
    const result = await db.query(
      // UPDATE changes existing rows. SET says what to change.
      // WHERE makes sure we only update the RIGHT student.
      `UPDATE registrations SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No registration found with id ${id}` });
    }

    res.status(200).json({
      message: `Registration ${id} updated to "${status}"`,
      data:    result.rows[0]
    });

  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ error: 'Could not update status.' });
  }
});


// ============================================================
//  ROUTE 5: DELETE /api/registrations/:id
//  Purpose: Remove a registration from the database
// ============================================================

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      // DELETE FROM removes the row. RETURNING * gives us the deleted row.
      'DELETE FROM registrations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `No registration found with id ${id}` });
    }

    res.status(200).json({
      message: `Registration for ${result.rows[0].first_name} deleted successfully.`
    });

  } catch (error) {
    console.error('Error deleting registration:', error.message);
    res.status(500).json({ error: 'Could not delete registration.' });
  }
});


// Export the router so server.js can use it
module.exports = router;
