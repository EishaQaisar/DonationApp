import * as SQLite from 'expo-sqlite';

// Open the SQLite database
export const db = SQLite.openDatabaseSync('donations.db');

// Function to add a clothes donation
export const addClothesDonation = async (clothesData) => {
  const { season, gender, ageCategory, size, condition, quantity, fabric, description, images, donorUsername } = clothesData;

  try {
    const statement = await db.prepareAsync(
      `INSERT INTO clothes_donations (season, gender, age_category, size, condition, quantity, fabric, description, images, donorUsername) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    await statement.executeAsync([
      season, 
      gender, 
      ageCategory, 
      size, 
      condition, 
      quantity, 
      fabric, 
      description, 
      JSON.stringify(images), // Store images as a stringified JSON array
      donorUsername
    ]);

    console.log('Clothes donation added successfully.');
  } catch (error) {
    console.error('Error adding clothes donation:', error);
  }
};
