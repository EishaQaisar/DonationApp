
import axios from 'axios';
import { getBaseUrl } from './deviceDetection';

export async function addClothesDonation(clothesData) {
  const { season, itemName, gender, ageCategory, size, c_condition, quantity, fabric, description, images, donorUsername } = clothesData;

  try {
    // Send POST request to backend API
    const BASE_URL = await getBaseUrl();
    console.log("this is the base url is", BASE_URL)
    const response = await axios.post(`${BASE_URL}/api/add-clothes-donation`, {
      season,
      itemName,
      gender,
      ageCategory,
      size,
      c_condition,
      quantity,
      fabric,
      description,
      images,
      donorUsername,
    });
    console.log('Clothes donation added successfully:', response.data);
  } catch (error) {
    console.error('Error adding clothes donation:', error);
  }
}





