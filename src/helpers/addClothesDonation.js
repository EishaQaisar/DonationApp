
import axios from 'axios';

export async function addClothesDonation(clothesData) {
  const { season, gender, ageCategory, size, c_condition, quantity, fabric, description, images, donorUsername } = clothesData;

  try {
    // Send POST request to backend API
    const response = await axios.post('http://10.0.2.2:3000/api/add-clothes-donation', {
      season,
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
