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
    const claimedItemsTable = `
    CREATE TABLE IF NOT EXISTS ClaimedItems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      itemName VARCHAR(255) NOT NULL,

      donorUsername VARCHAR(255) NOT NULL,
      claimerUsername VARCHAR(255) NOT NULL,
      donationType VARCHAR(255) NOT NULL, -- Type of donation (e.g., food, clothes, education)
      itemId INT NOT NULL, -- The ID of the donated item
      claimDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      scheduledelivery VARCHAR(255) DEFAULT 'Unscehduled',
      claimStatus VARCHAR(255) DEFAULT 'Claimed',
      khairPoints INT NOT NULL

      
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
    itemCategory VARCHAR(255) NOT NULL,
    clothesCategory VARCHAR(255) NOT NULL,
    shoeSize VARCHAR(255)  DEFAULT '-',
    upperWearSize VARCHAR(255)  DEFAULT '-',
    bottomWearSize VARCHAR(255)  DEFAULT '-',
    clothingSize VARCHAR(255)  DEFAULT '-',
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
    institution VARCHAR(255)  DEFAULT '-',
    grade VARCHAR(255)  DEFAULT '-',

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
    db.query(claimedItemsTable, (err, result) => {
      if (err) {
        console.log('Error creating ClaimedItems table:', err);
      } else {
        console.log('ClaimedItems table created successfully');
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
    const { season, gender, ageCategory, itemCategory,  clothesCategory,
      shoeSize,
      upperWearSize,
      bottomWearSize,
      clothingSize, c_condition, quantity, fabric, description, images, donorUsername } = req.body;
  
    console.log("Received data:", { season, gender, ageCategory,itemCategory, clothesCategory,
      shoeSize,
      upperWearSize,
      bottomWearSize,
      clothingSize,  c_condition, quantity, fabric, description, images, donorUsername });
  
    const query = `
      INSERT INTO clothesdonations (season, gender,  age_category, itemCategory, clothesCategory,
       shoeSize,
      upperWearSize,
      bottomWearSize,
      clothingSize,  c_condition, quantity, fabric, description, images, donorUsername)
      VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
    `;
  
    // Log the data being passed to the query
    console.log('Executing query with:', [season, gender, ageCategory, itemCategory, clothesCategory, shoeSize, upperWearSize, bottomWearSize,
      clothingSize, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername]);
  
    db.query(query, [season, gender, ageCategory, itemCategory, clothesCategory, shoeSize, upperWearSize, bottomWearSize,
      clothingSize, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername], (err, results) => {
      if (err) {
        console.error('Error inserting clothes donation:', err);
        return res.status(500).send('Error inserting clothes donation');
      }
      console.log('Insert result:', results); // Log the results to ensure insertion
      res.status(200).send('Clothes donation added successfully');
    });
});
app.get("/api/food-donations", (req, res) => {
  const userProfile = JSON.parse(req.query.userProfile || "{}")

  // Extract person count and children count instead of total members
  const personCount = 1 // The person themselves
  const childrenProfiles = userProfile.childrenProfiles || []
  const childrenCount = childrenProfiles.length
  const totalCount = personCount + childrenCount
  console.log(totalCount)

  // Query for all unclaimed food donations
  const query = "SELECT * FROM fooddonations WHERE claimStatus = ?"

  db.query(query, ["Unclaimed"], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).send("Error fetching data")
    }

    // Function to check if a food item is recommended based on quantity
    const isRecommended = (item) => {
      // Check if the donation quantity is appropriate for the person and their children
      // Recommend items where quantity is sufficient but not excessive
      return item.quantity >= totalCount && item.quantity <= totalCount * 1.5
    }

    // Filter recommendations
    const recommended = results.filter(isRecommended)

    // Filter other items that do not match the quantity criteria
    const others = results.filter((item) => !isRecommended(item))

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


app.get('/api/all-food-donations', (req, res) => {
    const query = 'SELECT * FROM fooddonations WHERE claimStatus = ?';
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
    const { type, level, c_condition, quantity, itemName, description, images, subject, institution, grade, donorUsername } = req.body;
  
    const query = `
      INSERT INTO EducationDonations (type, level, c_condition, quantity, itemName, description, images, subject,institution, grade, donorUsername)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;
  
    db.query(query, [type, level, c_condition, quantity, itemName, description, JSON.stringify(images), subject, institution, grade ,donorUsername], (err, results) => {
      if (err) {
        console.error('Error inserting education donation:', err);
        return res.status(500).send('Error inserting education donation');
      }
      res.status(200).send('Education donation added successfully');
    });
  });

  
  app.get("/api/education-donations", (req, res) => {
    const userProfile = JSON.parse(req.query.userProfile || "{}")
    const childrenProfiles = userProfile.childrenProfiles || [] // Extract children profiles
  
    // Query for all unclaimed education donations
    const query = "SELECT * FROM educationdonations WHERE claimStatus = ?"
  
    db.query(query, ["Unclaimed"], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err)
        return res.status(500).send("Error fetching data")
      }
  
      // Function to check if an item matches either the parent or any enrolled child's profile
      const isRecommended = (item) => {
        let parentMatch = false
        let childMatch = false
  
        // Different matching logic based on item type
        if (item.type === "Stationary") {
          // For stationary items, compare education level
          parentMatch = userProfile.educationLevel && item.level === userProfile.educationLevel
  
          // Check if any enrolled child's education level matches
          childMatch = childrenProfiles.some(
            (child) =>
              // Only consider children who are enrolled in education
              child.enrollmentStatus === "Enrolled" && child.educationLevel && item.level === child.educationLevel,
          )
        } else {
          // For non-stationary items, use the original matching logic
          parentMatch =
            ( userProfile.educationLevel==item.level && userProfile.institution &&
              item.institution.toLowerCase() === userProfile.institution.toLowerCase() &&
              userProfile.class &&
              item.grade === userProfile.class) ||
            (userProfile.class && item.grade === userProfile.class) && userProfile.educationLevel==item.level
  
          // Check if any enrolled child matches
          childMatch = childrenProfiles.some(
            (child) =>
              // Only consider children who are enrolled in education
              child.enrollmentStatus === "Enrolled" &&
              ((child.educationLevel==item.level && child.institution &&
                item.institution === child.institution &&
                child.class &&
                item.grade === child.class) ||
                (child.class && item.grade === child.class && child.educationLevel==item.level)),
          )
        }
  
        return parentMatch || childMatch
      }
  
      // Filter recommendations
      const recommended = results.filter(isRecommended)
  
      // Filter other items that do not match the recipient or children
      const others = results.filter((item) => !isRecommended(item))
  
      // Sort both arrays by createdAt in descending order
      const sortByCreatedAt = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      recommended.sort(sortByCreatedAt)
      others.sort(sortByCreatedAt)
      console.log(recommended)
      console.log(others)
  
      res.json({
        recommended: recommended,
        others: others,
      })
    })
  })
  
  app.get("/api/clothes-donations", (req, res) => {
    const userProfile = JSON.parse(req.query.userProfile || "{}");
    const childrenProfiles = userProfile.childrenProfiles || []; // Extract children profiles
  
    // Query for all unclaimed items
    const query = "SELECT * FROM clothesdonations WHERE claimStatus = ?";
  
    db.query(query, ["Unclaimed"], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).send("Error fetching data");
      }
  
      // Function to check if an item matches either the parent or any child's profile
      const isRecommended = (item) => {
        // Check for parent match based on item category and clothing category
        const parentMatch = (() => {
          // Gender must match in all cases
          if (userProfile.gender && item.gender !== userProfile.gender) {
            return false;
          }
  
          if (item.itemCategory === 'Clothes') {
            if (item.clothesCategory === 'Upper Wear') {
              return userProfile.shirtSize && item.upperWearSize === userProfile.shirtSize;
            } else if (item.clothesCategory === 'Bottom Wear') {
              return userProfile.trouserSize && item.bottomWearSize === userProfile.trouserSize;
            } else if (item.clothesCategory === 'Full Outfit') {
              return userProfile.clothingSize && item.clothingSize === userProfile.clothingSize;
            }
          } else if (item.itemCategory === 'Shoes') {
            return userProfile.shoeSize && item.shoeSize === userProfile.shoeSize;
          }
  
          return false;
        })();
  
        // Check if any child matches based on item category and clothing category
        const childMatch = childrenProfiles.some(child => {
          // Gender must match in all cases
          if (child.gender && item.gender !== child.gender) {
            return false;
          }
  
          if (item.itemCategory === 'Clothes') {
            if (item.clothesCategory === 'Upper Wear') {
              return child.shirtSize && item.upperWearSize === child.shirtSize;
            } else if (item.clothesCategory === 'Bottom Wear') {
              return child.trouserSize && item.bottomWearSize === child.trouserSize;
            } else if (item.clothesCategory === 'Full Outfit') {
              return child.clothingSize && item.clothingSize === child.clothingSize;
            }
          } else if (item.itemCategory === 'Shoes') {
            return child.shoeSize && item.shoeSize === child.shoeSize;
          }
  
          return false;
        });
  
        return parentMatch || childMatch;
      };
  
      // Filter recommendations
      const recommended = results.filter(isRecommended);
  
      // Filter other items that do not match parent or children
      const others = results.filter((item) => !isRecommended(item));
  
      // Sort both arrays by createdAt in descending order
      const sortByCreatedAt = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
      recommended.sort(sortByCreatedAt);
      others.sort(sortByCreatedAt);
  
      res.json({
        recommended: recommended,
        others: others,
      });
    });
  });
  app.get("/api/all-clothes-donations", (req, res) => {
    const query = "SELECT * FROM clothesdonations WHERE claimStatus = ?"
    db.query(query, ["Unclaimed"], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err)
        return res.status(500).send("Error fetching data")
      }
      res.json(results)
    })
  })
  app.get("/api/all-education-donations", (req, res) => {
    const query = "SELECT * FROM educationdonations WHERE claimStatus = ?"
    db.query(query, ["Unclaimed"], (err, results) => {
      if (err) {
        console.error("Error fetching education donations:", err)
        return res.status(500).send("Error fetching data")
      }
      res.json(results)
    })
  })



  /*notification funcs*/
  app.post('/api/add-claimed-item', (req, res) => {
    console.log(req.body);
    const { donorUsername, claimerUsername, donationType,claimStatus,itemName, itemId,scheduledelivery, khairPoints } = req.body;
    // const claimStatus = 'Claimed';

    console.log("Received data:", { donorUsername, claimerUsername, donationType,itemName, itemId, claimStatus,scheduledelivery,khairPoints });

    // Query to insert a claimed item into the ClaimedItems table
    const query = `
      INSERT INTO ClaimedItems (donorUsername, claimerUsername, donationType,itemName, itemId, scheduledelivery,claimStatus, khairPoints)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;

    // Log the data being passed to the query
    console.log('Executing query with:', [donorUsername, claimerUsername, donationType,    itemName ,
      itemId,scheduledelivery,claimStatus|| 'Claimed'],khairPoints);

    // Execute the query
    db.query(query, [donorUsername, claimerUsername, donationType,itemName, itemId,scheduledelivery, claimStatus || 'Claimed', khairPoints], (err, results) => {
        if (err) {
            console.error('Error inserting claimed item:', err);
            return res.status(500).send('Error claiming item');
        }
        console.log('Insert result:', results); // Log the results to ensure insertion
        res.status(200).send('Item claimed successfully');
    });
});


    // API endpoint to approve a claimed item
app.post('/api/approve-claim', (req, res) => {
  const { id } = req.body;

  const query = `
    UPDATE ClaimedItems 
    SET claimStatus = 'Approved' 
    WHERE id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error approving claim:', err);
      return res.status(500).send('Error approving claim');
    }
    res.status(200).send('Claim approved successfully');
  });
});

// API endpoint to delete a claim (decline a claim)

app.delete('/api/delete-claim/:id', (req, res) => {
  const { id } = req.params;
  const { itemId, category } = req.query; // Extract `itemId` and `category` from query parameters

  let query;
  let values;

  if (id !== 'null') {
    // Delete by `id` if it exists in the request
    query = `DELETE FROM ClaimedItems WHERE id = ?`;
    values = [id];
  } else if (itemId && category) {
    // Delete by `itemId` and `category` if provided
    query = `DELETE FROM ClaimedItems WHERE itemId = ? AND donationType = ?`;
    values = [itemId, category];
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request: Provide either claim ID or both itemId and category',
    });
  }

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error deleting claim:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error deleting claim',
      });
    }

    // Check if any rows were deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Claim not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Claim deleted successfully',
    });
  });
});

  //for tables after clicking yes
  app.post('/api/approve-claims', (req, res) => {
    const { id,category } = req.body;
    console.log("id while updating",id);
  
    let query = '';
    
    // Determine which table to update based on the category
    switch (category) {
      case 'Education':
        query = `
          UPDATE educationdonations 
          SET claimStatus = 'Claimed' 
          WHERE id = ?
        `;
        break;
      case 'Clothes':
        query = `
          UPDATE clothesdonations 
          SET claimStatus = 'Claimed' 
          WHERE id = ?
        `;
        break;
      case 'Food':
        query = `
          UPDATE fooddonations 
          SET claimStatus = 'Claimed' 
          WHERE id = ?
        `;
        break;
      default:
        return res.status(400).send('Invalid category');
    }
  
    // Execute the query with the item ID
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error approving claim:', err);
        return res.status(500).send('Error approving claim');
      }
      res.status(200).send('Claim updated successfully');
    });
  });
  //api to return notifications to recipient
  app.get('/api/claimed-status', (req, res) => {
    const query = 'SELECT * FROM ClaimedItems WHERE claimStatus = ?';
    
    // Execute the database query with 'Approved' status instead of 'Claimed'
    db.query(query, ['Approved'], (err, results) => {
        if (err) {
            // Log the error for debugging
            console.error('Error fetching claimed items:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching claimed items',
                error: err.message, // Optional: Return the actual error for debugging (remove in production)
            });
        }

        // Return the results in a structured format
        return res.status(200).json({
            status: 'success',
            data: results,
        });
    });
});


 app.get('/api/claimed-items', (req, res) => {
    const query = 'SELECT * FROM ClaimedItems WHERE claimStatus = ?';
    
    // Execute the database query
    db.query(query, ['Claimed'], (err, results) => {
        if (err) {
            // Log the error for debugging
            console.error('Error fetching claimed items:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching claimed items',
                error: err.message, // Optional: Return the actual error for debugging (remove in production)
            });
        }

        // Return the results in a structured format
        return res.status(200).json({
            status: 'success',
            data: results,
        });
    });
});

//for revesing to unclaimed if declined
app.post('/api/reverse-claim-status', (req, res) => {
  const { itemId,category } = req.body;
  console.log(req.body)
  console.log("sefesfe",itemId,category)

  let query = '';
  
  // Determine which table to update based on the category
  switch (category) {
    case 'Education':
      query = `
        UPDATE educationdonations 
        SET claimStatus = 'Unclaimed' 
        WHERE id = ?
      `;
      break;
    case 'Clothes':
      query = `
        UPDATE clothesdonations 
        SET claimStatus = 'Unclaimed' 
        WHERE id = ?
      `;
      break;
    case 'Food':
      query = `
        UPDATE fooddonations 
        SET claimStatus = 'Unclaimed' 
        WHERE id = ?
      `;
      break;
    default:
      return res.status(400).send('Invalid category');
  }

  // Execute the query with the item ID
  db.query(query, [itemId], (err, result) => {
    if (err) {
      console.error('Error declining claim:', err);
      return res.status(500).send('Error declined claim');
    }
    res.status(200).send('Claim updated successfully');
  });
});

