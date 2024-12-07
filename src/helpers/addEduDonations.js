import axios from 'axios';
import { getBaseUrl } from './deviceDetection';

export async function addEduDonation(eduData) {
  const {
    type,
    level,
    c_condition,
    quantity,
    itemName,
    description,
    images,
    subject,
    donorUsername
  } = eduData;

  try {
    // Send POST request to backend API
    const BASE_URL = await getBaseUrl();
    console.log("this is the base url is", BASE_URL)
    const response = await axios.post(`${BASE_URL}/api/add-education-donation`, {
      type,
      level,
      c_condition,
      quantity,
      itemName,
      description,
      images,
      subject,
      donorUsername,
    });

    console.log('Education donation added successfully:', response.data);
  } catch (error) {
    console.error('Error adding education donation:', error);
  }
}
