const mysql = require('mysql');
const express = require('express');
const cors= require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default WAMP MySQL user
  password: '', // Default WAMP MySQL password is empty
  database: 'donations' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Create a route to get data from the database
app.get('/', (req, res) => {
  return res.json('bachned side');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

const createTables = () => {
    const donationsTable = `
      CREATE TABLE IF NOT EXISTS Donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(255) NOT NULL
      );
    `;
  
    const foodDonationsTable = `
      CREATE TABLE IF NOT EXISTS FoodDonations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        foodName VARCHAR(255) NOT NULL,
        description VARCHAR(100),
        mealType VARCHAR(255) NOT NULL,
        foodType VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        images TEXT,
        claimStatus VARCHAR(255) DEFAULT 'Unclaimed',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        donorUsername VARCHAR(255) NOT NULL
      );
    `;
   
  

    const clothesDonationsTable = `
      CREATE TABLE IF NOT EXISTS ClothesDonations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fabric VARCHAR(255) NOT NULL,
    itemName VARCHAR(255) NOT NULL,
    size VARCHAR(10) NOT NULL,
    c_condition VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    season VARCHAR(50) NOT NULL,
    description TEXT,
    age_category VARCHAR(50) NOT NULL,
    images TEXT,
    claimStatus VARCHAR(255) DEFAULT 'Unclaimed',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    donorUsername VARCHAR(255) NOT NULL
);

    `;

    const educationDonationsTable = `
  CREATE TABLE IF NOT EXISTS EducationDonations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    c_condition VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    itemName VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT,
    subject VARCHAR(255)  DEFAULT '-',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimStatus VARCHAR(255) DEFAULT 'Unclaimed',
    donorUsername VARCHAR(255) NOT NULL
  );
`;

  
    db.query(donationsTable, (err, result) => {
      if (err) {
        console.log('Error creating Donations table:', err);
      } else {
        console.log('Donations table created successfully');
      }
    });
  
    db.query(foodDonationsTable, (err, result) => {
      if (err) {
        console.log('Error creating FoodDonations table:', err);
      } else {
        console.log('FoodDonations table created successfully');
      }
    });
  
    db.query(clothesDonationsTable, (err, result) => {
      if (err) {
        console.log('Error creating ClothesDonations table:', err);
      } else {
        console.log('ClothesDonations table created successfully');
      }
    });
    db.query(educationDonationsTable, (err, result) => {
      if (err) {
        console.log('Error creating EducationDonations table:', err);
      } else {
        console.log('EducationDonations table created successfully');
      }
    });

    
  };
  
  // Call the function to create the tables
  createTables();

  // API endpoint to add a food donation


  app.post('/api/add-food-donation', (req, res) => {
    console.log(req.body);
    const { foodName, description, mealType, foodType, quantity, images, donorUsername } = req.body;
  
    console.log("Received data:", { foodName, description, mealType, foodType, quantity, images, donorUsername });
  
    const query = `
      INSERT INTO FoodDonations (foodName, description, mealType, foodType, quantity, images, donorUsername)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Log the data being passed to the query
    console.log('Executing query with:', [foodName, description, mealType, foodType, quantity, JSON.stringify(images), donorUsername]);
  
    db.query(query, [foodName, description, mealType, foodType, quantity, JSON.stringify(images), donorUsername], (err, results) => {
      if (err) {
        console.error('Error inserting food donation:', err);
        return res.status(500).send('Error inserting food donation');
      }
      console.log('Insert result:', results); // Log the results to ensure insertion
      res.status(200).send('Food donation added successfully');
    });
  });
  
  app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM fooddonations'; // Replace with your table name
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result); // Send the data back to the client
    });
  });

  app.post('/api/add-clothes-donation', (req, res) => {
    console.log("hjeree");
    console.log(req.body);
    const { season, gender,itemName, ageCategory, size, c_condition, quantity, fabric, description, images, donorUsername } = req.body;
  
    console.log("Received data:", { season, gender, itemName, ageCategory, size, c_condition, quantity, fabric, description, images, donorUsername });
  
    const query = `
      INSERT INTO clothesdonations (season,itemName, gender,  age_category, size, c_condition, quantity, fabric, description, images, donorUsername)
      VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Log the data being passed to the query
    console.log('Executing query with:', [season, gender, ageCategory, size, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername]);
  
    db.query(query, [season,itemName, gender, ageCategory, size, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername], (err, results) => {
      if (err) {
        console.error('Error inserting clothes donation:', err);
        return res.status(500).send('Error inserting clothes donation');
      }
      console.log('Insert result:', results); // Log the results to ensure insertion
      res.status(200).send('Clothes donation added successfully');
    });
});

app.get('/api/food-donations', (req, res) => {
    const query = 'SELECT * FROM FoodDonations WHERE claimStatus = ?';
    db.query(query, ['Unclaimed'], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Error fetching data');
      }
      res.json(results);
    });
  });
  /*
  app.get('/api/clothes-donations', (req, res) => {

    
    const query = 'SELECT * FROM clothesdonations WHERE claimStatus = ?';
    db.query(query, ['Unclaimed'], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Error fetching data');
      }
      res.json(results);
    });
  });
  */

  app.post('/api/add-education-donation', (req, res) => {
    const { type, level, c_condition, quantity, itemName, description, images, subject, donorUsername } = req.body;
  
    const query = `
      INSERT INTO EducationDonations (type, level, c_condition, quantity, itemName, description, images, subject, donorUsername)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [type, level, c_condition, quantity, itemName, description, JSON.stringify(images), subject, donorUsername], (err, results) => {
      if (err) {
        console.error('Error inserting education donation:', err);
        return res.status(500).send('Error inserting education donation');
      }
      res.status(200).send('Education donation added successfully');
    });
  });

  
  app.get('/api/education-donations', (req, res) => {
    const query = 'SELECT * FROM EducationDonations WHERE claimStatus = ?';
    db.query(query, ['Unclaimed'], (err, results) => {
      if (err) {
        console.error('Error fetching education donations:', err);
        return res.status(500).send('Error fetching data');
      }
      res.json(results);
    });
  });
  
  
  app.get("/api/clothes-donations", (req, res) => {
    const userProfile = JSON.parse(req.query.userProfile || "{}")
  
    // Query for all unclaimed items
    const query = "SELECT * FROM clothesdonations WHERE claimStatus = ?"
  
    db.query(query, ["Unclaimed"], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err)
        return res.status(500).send("Error fetching data")
      }
  
      // Filter and sort the results based on user profile
      const recommended = results.filter(
        (item) =>
          (userProfile.clothingSize && item.size === userProfile.clothingSize) ||
          (userProfile.gender && item.gender === userProfile.gender),
      )
  
      const others = results.filter(
        (item) =>
          (!userProfile.clothingSize || item.size !== userProfile.clothingSize) &&
          (!userProfile.gender || item.gender !== userProfile.gender),
      )
  
      // Sort both arrays by createdAt in descending order
      const sortByCreatedAt = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      recommended.sort(sortByCreatedAt)
      others.sort(sortByCreatedAt)
  
      res.json({
        recommended: recommended,
        others: others,
      })
    })
  })