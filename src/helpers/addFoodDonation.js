
  import axios from 'axios';

  export async function addFoodDonation(foodData) {
    const { foodName, description, mealType, foodType, quantity, images, donorUsername } = foodData;
  
    try {
      // Send POST request to backend API
      const response = await axios.post('http://10.0.2.2:3000/api/add-food-donation', {
        foodName,
        description,
        mealType,
        foodType,
        quantity,
        images,
        donorUsername,
      });
  
      console.log('Food donation added successfully:', response.data);
    } catch (error) {
      console.error('Error adding food donation:', error);
    }
  }
  