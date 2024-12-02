import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from "../core/theme";

const ImagePickerComponent = ({ maxImages = 3, selectedImages = [], onImagesChange }) => {
  const [images, setImages] = useState(selectedImages);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets;

      // Check if selected images exceed the maxImages limit
      if (selectedImages.length + images.length > maxImages) {
        alert(`Please select a maximum of ${maxImages} images.`);
      } else {
        // Append selected images to the existing ones
        const updatedImages = [...images, ...selectedImages.map(asset => asset.uri)];
        setImages(updatedImages);
        onImagesChange(updatedImages); // Pass the updated images to parent component
      }
    } 
  };

  const deleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages); // Pass the updated images to parent component
  };

  const replaceImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false, // Allow only single image selection
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length === 1) {
      const updatedImages = [...images];
      updatedImages[index] = result.assets[0].uri; // Replace the selected image
      setImages(updatedImages);
      onImagesChange(updatedImages); // Pass the updated images to parent component
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.headings}>Select Images</Text>
      <TouchableOpacity style={styles.imageContainer}  onPress={images.length < maxImages ? pickImage : null} >
        {images.length > 0 ? (
          images.map((uri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => replaceImage(index)} // Press to pick new image or replace
              style={styles.imageWrapper}
            >
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Image source={require('../../assets/items/imgPlaceholder.jpg')} style={styles.imagePreview} />
        )}
        {images.length < maxImages && images.length > 0 &&(
          <TouchableOpacity onPress={pickImage}>
            <Image source={require('../../assets/items/imgPlaceholder.jpg')} style={styles.imagePreview} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ivory,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.TaupeBlack,
    borderRadius: 10,
    padding: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImagePickerComponent;
