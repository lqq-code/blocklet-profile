const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./connect'); // Assuming this is the path to your connect.js file

const app = express();
const corsOptions = {
  origin: 'http://localhost:8093', // Update with your client's origin
  optionsSuccessStatus: 200,
};

// Adding BodyParser to parse the body of POST requests.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors(corsOptions));

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({ message: 'Ok' });
});

// GET SINGLE USER by ID
app.get('/api/users', cors(corsOptions), (req, res) => {
  const query = 'SELECT * FROM users LIMIT 1;';  // Limit to one record
  const params = [];
  return db.get(query, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({
      message: 'success',
      data: row,
    });
  });
});

app.put('/api/update/users/:id', cors(corsOptions), (req, res) => {
  const userId = req.params.id;
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const query = `UPDATE users SET 
    name = COALESCE(?, name), 
    email = COALESCE(?, email), 
    phone = COALESCE(?, phone)
    WHERE id = ?;`;

  const params = [
    data.name,
    data.email,
    data.phone,
    userId,
  ];

  db.run(query, params, function (err) {
    if (err) {
      res.status(400).json({ status: 'bad', error: err });
      return;
    }

    // Fetch the updated user data
    const fetchQuery = 'SELECT * FROM users WHERE id = ?';
    const fetchParams = [userId];

    db.get(fetchQuery, fetchParams, (fetchErr, row) => {
      if (fetchErr) {
        res.status(400).json({ status: 'error', message: 'Failed to fetch updated user' });
        return;
      }

      res.status(200).json({
        message: 'success',
        data: row, // Include the updated user data
        changes: this.changes, // Number of rows affected by the update
      });
    });
  });
});



// SERVER PORT
const HTTP_PORT = process.env.PORT || 4015;

// START SERVER
app.listen(HTTP_PORT, () => {
  console.log(`Job Dispatch API running on port ${HTTP_PORT}!`);
});
