import * as SQLite from 'expo-sqlite';

// Open the SQLite database
export const db = SQLite.openDatabaseSync('donations.db');


export async function addFoodDonation(foodData) {
    const { foodName, description, mealType, foodType, quantity, images, donorUsername } = foodData;
    

  
    try {
      const statement = await db.prepareAsync(
        `INSERT INTO FoodDonations (foodName, description, mealType, foodType, quantity, images, donorUsername) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      await statement.executeAsync([foodName, description, mealType, foodType, quantity, JSON.stringify(images), donorUsername]);
      console.log('Food donation added successfully.');
    } catch (error) {
      console.error('Error adding food donation:', error);
    }
  }
  