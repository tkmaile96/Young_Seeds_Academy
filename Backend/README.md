# Tirelo Maile — Backend API
### A learning-friendly Node.js + PostgreSQL backend

---

## 📁 Project Structure
```
tirelo-backend/
├── server.js            ← Entry point. Starts the server.
├── db.js                ← Database connection (PostgreSQL)
├── setup.sql            ← Run once to create your tables
├── package.json         ← Lists all packages/dependencies
├── .env.example         ← Template for your secret config
├── .env                 ← YOUR actual config (you create this)
└── routes/
    ├── registrations.js ← All registration API routes
    └── contacts.js      ← All contact message API routes
```

---

## 🚀 Step-by-Step Setup Guide

### STEP 1 — Install Node.js
Download and install from: https://nodejs.org
Choose the "LTS" version (Long Term Support = stable).

To check it installed correctly, open your terminal and run:
```bash
node --version    # Should print something like v18.x.x
npm --version     # npm comes with Node. Should print a version.
```

---

### STEP 2 — Install PostgreSQL
Download from: https://www.postgresql.org/download/
During install:
- Set a password for the "postgres" user — REMEMBER THIS
- Leave the default port as 5432

After installing, also install **pgAdmin** (usually bundled with PostgreSQL).
pgAdmin is a visual tool to see your database like a spreadsheet.

---

### STEP 3 — Create Your Database
Open **pgAdmin** or your terminal and run:

```sql
CREATE DATABASE tirelo_classes;
```

In pgAdmin:
- Right-click "Databases" → Create → Database
- Name it: tirelo_classes
- Click Save

---

### STEP 4 — Create Your Tables
In pgAdmin, connect to tirelo_classes, open the Query Tool, paste
the contents of setup.sql and click Run (▶).

You should see two tables created: registrations and contacts.

---

### STEP 5 — Set Up This Project
Open your terminal, navigate to this folder and run:

```bash
# Install all the packages listed in package.json
npm install
```

This creates a node_modules/ folder with all your dependencies.

---

### STEP 6 — Create Your .env File
Copy the example file:
```bash
cp .env.example .env
```

Then open .env and fill in YOUR actual PostgreSQL password:
```
DB_PASSWORD=the_password_you_set_in_step_2
```

---

### STEP 7 — Start the Server
```bash
# For development (auto-restarts when you change code):
npm run dev

# For normal start:
npm start
```

You should see:
```
✅ Server is running on http://localhost:5000
✅ Connected to PostgreSQL database successfully!
```

---

## 🧪 Testing Your API

Use a free tool called **Postman** (https://postman.com) or
**Thunder Client** (VS Code extension) to test your routes.

### Register a student:
```
POST http://localhost:5000/api/registrations
Body (JSON):
{
  "first_name": "Lerato",
  "last_name": "Dlamini",
  "email": "lerato@gmail.com",
  "phone": "0712345678",
  "grade": "Grade 9",
  "preferred_time": "Weekday Afternoons"
}
```

### Get all registrations:
```
GET http://localhost:5000/api/registrations
```

### Confirm a student (change their status):
```
PUT http://localhost:5000/api/registrations/1/status
Body (JSON):
{
  "status": "confirmed"
}
```

---

## 🌐 API Reference

### Registrations
| Method | URL                                  | What it does                  |
|--------|--------------------------------------|-------------------------------|
| POST   | /api/registrations                   | Save a new registration       |
| GET    | /api/registrations                   | Get all registrations         |
| GET    | /api/registrations/:id               | Get one registration by ID    |
| PUT    | /api/registrations/:id/status        | Update status (confirm/cancel)|
| DELETE | /api/registrations/:id               | Delete a registration         |

### Contacts
| Method | URL                        | What it does              |
|--------|----------------------------|---------------------------|
| POST   | /api/contacts              | Save a contact message    |
| GET    | /api/contacts              | Get all messages          |
| PUT    | /api/contacts/:id/read     | Mark message as read      |
| DELETE | /api/contacts/:id          | Delete a message          |

---

## 🔗 Connecting Your Blog Form

In your tirelo_blog.html, update the form's submit handler to send
data to this API instead of just showing a success message.

Replace the handleSubmit function with:

```javascript
async function handleSubmit(e, type) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const endpoint = type === 'registration'
    ? 'http://localhost:5000/api/registrations'
    : 'http://localhost:5000/api/contacts';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // Show success
      form.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    alert('Could not connect to server. Is it running?');
  }
}
```

---

## 📦 Packages Used & Why

| Package  | What it does                                      |
|----------|---------------------------------------------------|
| express  | The web framework — handles routes and requests   |
| pg       | Connects Node.js to PostgreSQL                    |
| cors     | Allows your blog frontend to call this API        |
| dotenv   | Reads secret config from .env file                |
| nodemon  | Auto-restarts server when you edit code (dev only)|
