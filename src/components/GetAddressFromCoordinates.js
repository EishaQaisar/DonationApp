// GetAddressFromCoordinates.js
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import axios from 'axios';

const GetAddressFromCoordinates = ({ latitude, longitude }) => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAddress = async () => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      setAddress(response.data.display_name);
    } catch (err) {
      setError("Error fetching address");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      getAddress();
    }
  }, [latitude, longitude]);

  if (loading) return <Text>Loading address...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View>
      {address ? <Text>Address: {address}</Text> : <Text>No address found</Text>}
    </View>
  );
};

export default GetAddressFromCoordinates;
