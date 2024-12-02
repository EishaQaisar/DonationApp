import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('donations.db');

export async function setupTables() {
  await db.execAsync(`
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;

    CREATE TABLE IF NOT EXISTS Donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS FoodDonations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodName TEXT NOT NULL,
      description TEXT CHECK(LENGTH(description) <= 100),
      mealType TEXT NOT NULL,
      foodType TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      images TEXT,
      claimStatus TEXT DEFAULT 'Unclaimed',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      donorUsername TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clothes_donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fabric TEXT NOT NULL,
        size TEXT NOT NULL, -- Store sizes as strings (e.g., 'S', 'M', etc.)
        condition TEXT NOT NULL, -- Store conditions as strings (e.g., 'New', 'Used Once/Twice')
        gender TEXT NOT NULL, -- Store gender as strings ('Male', 'Female', 'Unisex')
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        season TEXT NOT NULL, 
        description TEXT, 
        age_category TEXT NOT NULL, 
        images TEXT, -- Store JSON stringified array of image URIs
        claimStatus TEXT DEFAULT 'Unclaimed',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        donorUsername TEXT NOT NULL


      );

  `);
}
