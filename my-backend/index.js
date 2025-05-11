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
        donorUsername VARCHAR(255) NOT NULL,
        donorCity VARCHAR(255) NOT NULL

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
    donorUsername VARCHAR(255) NOT NULL,
    donorCity VARCHAR(255) NOT NULL
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
    donorUsername VARCHAR(255) NOT NULL,
    donorCity VARCHAR(255) NOT NULL

  );
`;

const ngoCampaignsTable = `
  CREATE TABLE IF NOT EXISTS NGOCampaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ngoName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    bankAccount VARCHAR(16) NOT NULL,
    campaignTitle VARCHAR(255) NOT NULL,
    shortDescription VARCHAR(255) NOT NULL,
    fullDescription TEXT NOT NULL,
    image TEXT NOT NULL,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimStatus VARCHAR(255) DEFAULT 'Unclaimed',
    campaignCreatorUsername VARCHAR(255) NOT NULL
  );
`;
db.query(ngoCampaignsTable, (err, result) => {
  if (err) {
    console.log('Error creating NGOCampaigns table:', err);
  } else {
    console.log('NGOCampaigns table created successfully');
  }
});

  
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
    const { foodName, description, mealType, foodType, quantity, images, donorUsername,donorCity } = req.body;
  
    console.log("Received data:", { foodName, description, mealType, foodType, quantity, images, donorUsername,donorCity });
  
    const query = `
      INSERT INTO FoodDonations (foodName, description, mealType, foodType, quantity, images, donorUsername,donorCity)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
  
    // Log the data being passed to the query
    console.log('Executing query with:', [foodName, description, mealType, foodType, quantity, JSON.stringify(images), donorUsername,donorCity]);
  
    db.query(query, [foodName, description, mealType, foodType, quantity, JSON.stringify(images), donorUsername,donorCity], (err, results) => {
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
      clothingSize, c_condition, quantity, fabric, description, images, donorUsername,donorCity } = req.body;
  
    console.log("Received data:", { season, gender, ageCategory,itemCategory, clothesCategory,
      shoeSize,
      upperWearSize,
      bottomWearSize,
      clothingSize,  c_condition, quantity, fabric, description, images, donorUsername,donorCity });
  
    const query = `
      INSERT INTO clothesdonations (season, gender,  age_category, itemCategory, clothesCategory,
       shoeSize,
      upperWearSize,
      bottomWearSize,
      clothingSize,  c_condition, quantity, fabric, description, images, donorUsername,donorCity)
      VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
    `;
  
    // Log the data being passed to the query
    console.log('Executing query with:', [season, gender, ageCategory, itemCategory, clothesCategory, shoeSize, upperWearSize, bottomWearSize,
      clothingSize, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername,donorCity]);
  
    db.query(query, [season, gender, ageCategory, itemCategory, clothesCategory, shoeSize, upperWearSize, bottomWearSize,
      clothingSize, c_condition, quantity, fabric, description, JSON.stringify(images), donorUsername,donorCity], (err, results) => {
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
    const { type, level, c_condition, quantity, itemName, description, images, subject, institution, grade, donorUsername,donorCity } = req.body;
  
    const query = `
      INSERT INTO EducationDonations (type, level, c_condition, quantity, itemName, description, images, subject,institution, grade, donorUsername,donorCity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
    `;
  
    db.query(query, [type, level, c_condition, quantity, itemName, description, JSON.stringify(images), subject, institution, grade ,donorUsername,donorCity], (err, results) => {
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
          if (userProfile.gender && item.gender !== userProfile.gender && item.gender !== "Unisex") {
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
          if (child.gender && item.gender !== child.gender && item.gender !== "Unisex") {
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
    const query = 'SELECT * FROM claimeditems WHERE claimStatus = ?';
    
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


app.get('/api/claimed-items/unscheduled', (req, res) => {
  const query = 'SELECT * FROM ClaimedItems WHERE scheduledelivery = ?';
  
  // Execute the database query
  db.query(query, ['Unscheduled'], (err, results) => {
      if (err) {
          // Log the error for debugging
          console.error('Error fetching unscheduled claimed items:', err);
          return res.status(500).json({
              status: 'error',
              message: 'Error fetching unscheduled claimed items',
              error: err.message, // Optional: Remove in production
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


app.get('/api/claimed-items', (req, res) => {
  const query = "SELECT * FROM ClaimedItems WHERE scheduleDelivery = 'Unscheduled'";
  console.log("hereee")

  // Execute the database query
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching claimed items:', err);
          return res.status(500).json({
              status: 'error',
              message: 'Error fetching claimed items',
              error: err.message, 
          });
      }

      return res.status(200).json({
          status: 'success',
          data: results,
      });
  });
});


app.get("/api/user-food-donations", (req, res) => {
  const userId = req.query.userId
console.log(userId)
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const query = "SELECT * FROM fooddonations WHERE donorUsername = ? ORDER BY createdAt DESC"

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).send("Error fetching data")
    }
    res.json(results)
  })
})
app.get("/api/user-clothes-donations", (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const query = "SELECT * FROM clothesdonations WHERE donorUsername = ? ORDER BY createdAt DESC"

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).send("Error fetching data")
    }
    res.json(results)
  })
})
app.get("/api/user-education-donations", (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const query = "SELECT * FROM educationdonations WHERE donorUsername = ? ORDER BY createdAt DESC"

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).send("Error fetching data")
    }
    res.json(results)
  })
})

app.get("/api/user-claimed-items", (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" })
  }

  const query = "SELECT * FROM claimeditems WHERE claimerUsername = ? ORDER BY claimDate DESC"

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err)
      return res.status(500).send("Error fetching data")
    }
    res.json(results)
  })
})


//adding campaignform to db
app.post('/api/add-ngo-campaign', (req, res) => {
  console.log(req.body);

  // Destructuring form data from the request body
  const { ngoName, email, phoneNumber, bankAccount, campaignTitle, shortDescription, fullDescription, image, campaignCreatorUsername } = req.body;

  console.log("Received data:", { ngoName, email, phoneNumber, bankAccount, campaignTitle, shortDescription, fullDescription, image, campaignCreatorUsername });

  const query = `
    INSERT INTO NGOCampaigns (ngoName, email, phoneNumber, bankAccount, campaignTitle, shortDescription, fullDescription, image, campaignCreatorUsername)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Log the data being passed to the query
  console.log('Executing query with:', [ngoName, email, phoneNumber, bankAccount, campaignTitle, shortDescription, fullDescription, image, campaignCreatorUsername]);

  db.query(query, [ngoName, email, phoneNumber, bankAccount, campaignTitle, shortDescription, fullDescription, image, campaignCreatorUsername], (err, results) => {
    if (err) {
      console.error('Error inserting NGO campaign:', err);
      return res.status(500).send('Error inserting NGO campaign');
    }
    console.log('Insert result:', results); // Log the results to ensure insertion
    res.status(200).send('NGO campaign added successfully');
  });
});


// GET API to fetch all NGO campaigns from the database
app.get('/api/get-ngo-campaigns', (req, res) => {
  const query = 'SELECT * FROM NGOCampaigns';

  // Log the query being executed
  console.log('Fetching all NGO campaigns...');

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching NGO campaigns:', err);
      return res.status(500).send('Error fetching NGO campaigns');
    }
    
    // Log the results to ensure data retrieval
    console.log('Fetched NGO campaigns:', results);
    res.status(200).json(results);
  });
});
// Example backend route (Node.js/Express)
app.get('/api/get-campaign-details/:id', async (req, res) => {
  try {
    const campaignId = req.params.id;
    // Query your database for the campaign with this ID
    const campaign = await db.query('SELECT * FROM ngocampaigns WHERE id = ?', [campaignId]);
    
    if (campaign.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign[0]);
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// API endpoint to get notification count
app.get('/api/get-notification-count', (req, res) => {
  const { username, role } = req.query;
  
  let query = '';
  
  if (role && role.toLowerCase() === 'donor') {
    // For donors: count of items with 'Claimed' status that belong to this donor
    query = 'SELECT COUNT(*) as count FROM claimeditems WHERE donorUsername = ? AND claimStatus = ?';
    db.query(query, [username, 'Claimed'], (err, results) => {
      if (err) {
        console.error('Error fetching notification count:', err);
        return res.status(500).json({ count: 0 });
      }
      return res.status(200).json({ count: results[0].count });
    });
  } else if (role && role.toLowerCase() === 'recipient') {
    // For recipients: count of items with 'Approved' status that belong to this recipient
    query = 'SELECT COUNT(*) as count FROM claimeditems WHERE claimerUsername = ? AND claimStatus = ?';
    db.query(query, [username, 'Approved'], (err, results) => {
      if (err) {
        console.error('Error fetching notification count:', err);
        return res.status(500).json({ count: 0 });
      }
      return res.status(200).json({ count: results[0].count });
    });
  } else {
    // Default response if role is not specified
    return res.status(200).json({ count: 0 });
  }
});

// API endpoint to reset notification count
app.get('/api/reset-notification-count', (req, res) => {
  const { username, role } = req.query;
  
  // For now, we'll just return success
  // In a real implementation, you might want to mark notifications as read in the database
  return res.status(200).json({ success: true });
});
app.get('/api/claimed-items/unscheduled', (req, res) => {
  console.log("here")
  const query = 'SELECT * FROM ClaimedItems WHERE scheduledelivery = ?';
  
  // Execute the database query
  db.query(query, ['Unscheduled'], (err, results) => {
      if (err) {
          // Log the error for debugging
          console.error('Error fetching unscheduled claimed items:', err);
          return res.status(500).json({
              status: 'error',
              message: 'Error fetching unscheduled claimed items',
              error: err.message, // Optional: Remove in production
          });
      }

      // Return the results in a structured format
      return res.status(200).json({
          status: 'success',
          data: results,
      });
  });
});



app.put("/api/update-delivery-status", (req, res) => {
  const { id, scheduledelivery } = req.body

  if (!id || !scheduledelivery) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: id and scheduledelivery ",
    })
  }

  console.log(`Updating delivery status for claimed item ${id} to ${scheduledelivery}`)

  const query = `
    UPDATE ClaimedItems 
    SET scheduledelivery = ? 
    WHERE id = ?
  `

  db.query(query, [scheduledelivery, id], (err, result) => {
    if (err) {
      console.error("Error updating delivery status:", err)
      return res.status(500).json({
        status: "error",
        message: "Error updating delivery status",
        error: err.message,
      })
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Claimed item not found",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Delivery status updated successfully",
      data: {
        id,
        scheduledelivery,
      },
    })
  })
})
