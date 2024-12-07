
import axios from 'axios';
import { getBaseUrl } from './deviceDetection';



export async function addFoodDonation(foodData){
  const { foodName, description, mealType, foodType, quantity, images, donorUsername } = foodData;
  try {
    const BASE_URL = await getBaseUrl();
    console.log("this is the base url is",BASE_URL)
    const response = await axios.post(`${BASE_URL}/api/add-food-donation`,{
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
    throw error;
  }
}
