import axios from 'axios';

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
    const response = await axios.post('http://10.0.2.2:3000/api/add-education-donation', {
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
