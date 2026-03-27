// ============================================================
//  server.js  —  The ENTRY POINT of your backend
//  This is the first file that runs when you start your server.
//  Think of it as the "front door" of your backend application.
// ============================================================

// ----- STEP 1: IMPORT THE TOOLS WE NEED -----
// "require" is how you bring in external packages in Node.js
// It's like saying "go fetch this tool from the toolbox"

const express = require('express');   // Express = the web framework. It handles incoming requests.
const cors    = require('cors');      // CORS = allows your blog (frontend) to talk to this server
const dotenv  = require('dotenv');    // dotenv = lets us read secret config from a .env file

// ----- STEP 2: LOAD ENVIRONMENT VARIABLES -----
dotenv.config();

// ----- STEP 3: CREATE THE EXPRESS APP -----
const app = express();

// ----- STEP 4: APPLY MIDDLEWARE -----
app.use(cors());
app.use(express.json());

// Convert camelCase to snake_case for all incoming requests
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const converted = {};
    for (let key in req.body) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      converted[snakeKey] = req.body[key];
    }
    req.body = converted;
  }
  next();
});
// ----- STEP 5: IMPORT YOUR ROUTES -----
const registrationRoutes = require('./registrations');
const contactRoutes      = require('./contacts');
const ndaRoutes         = require('./ndaAgreement');

// ----- STEP 6: TELL THE APP TO USE THOSE ROUTES -----
app.use('/api/registrations', registrationRoutes);
app.use('/api/contacts',      contactRoutes);
app.use('/api/ndaAgreement',           ndaRoutes);

// ----- STEP 7: A SIMPLE TEST ROUTE -----
app.get('/', (req, res) => {
  res.json({ message: 'Tirelo Maile Backend is running! 🎉' });
});

// ----- STEP 8: START THE SERVER -----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 Registrations API: http://localhost:${PORT}/api/registrations`);
  console.log(`✉️  Contacts API:      http://localhost:${PORT}/api/contacts`);
});
