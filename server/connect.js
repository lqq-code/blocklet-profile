const sqlite3 = require("sqlite3").verbose();

const tableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`;
const createTableQuery = `CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name VARCHAR(255) NOT NULL, 
  email VARCHAR(255) NOT NULL, 
  phone VARCHAR(255) NOT NULL
);`;
const insertQuery = `INSERT INTO users (name, email, phone) VALUES (?,?,?);`;

const db = new sqlite3.Database(
  "./db/database.sqlite",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("Connected to the SQLite database.");
      // Check if 'users' table exists
      db.all(tableCheckQuery, function (err, rows) {
        if (err) {
          console.error(err.message);
          throw err;
        }
        if (!rows.length) {
          // If 'users' table does not exist, create it
          db.run(createTableQuery, function (err) {
            if (err) {
              console.error("Error creating users table:", err.message);
            } else {
              console.log("'users' table created.");
              // Insert initial user data after table creation
              db.run(insertQuery, ['John Doe', 'XXXXX@gmail.com', '13012344321'], function (err) {
                if (err) {
                  console.error("Error inserting initial user data:", err.message);
                } else {
                  console.log("Initial user data inserted.");
                }
              });
            }
          });
        }
      });
    }
  }
);

module.exports = db;
