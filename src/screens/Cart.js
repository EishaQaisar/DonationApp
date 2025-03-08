import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
import { useCart } from '../CartContext'; // Import useCart
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon for back arrow

// Optional BackButton component
const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.backButton}>
    <Icon name="chevron-left" size={20} color={theme.colors.ivory} />
  </TouchableOpacity>
);

const Cart = ({route}) => {
  const { cartItems, removeFromCart } = useCart(); // Access cart context
  const navigation = useNavigation(); // Access navigation object
  // const route = useRoute();
const {role}=route.params;

  // Set the header options to include a back button
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton goBack={navigation.goBack} />
      ),
      headerStyle: {
        backgroundColor: theme.colors.charcoalBlack,
      },
      headerTitle: () => (
        <Text style={styles.headerTitle}>Your Cart</Text>
      ),
      headerTintColor: theme.colors.ivory, // Ensures that header text (like title) is white
    });
  }, [navigation]);

  // Check if the current route name is "Cart"
  const isCartPage = route.name === 'Cart';

  const renderItem = ({ item }) => (
  
    <View style={styles.itemRow}>
      <Image source={item.images[0]} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.itemName || item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.description}>{item.category}</Text>

      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item)} // Pass the item id to removeFromCart
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed header with icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Education')}>
          <Icon
            name="school"
            size={40}
            color={theme.colors.sageGreen}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Clothes')}>
          <Icon
            name="checkroom"
            size={40}
            color={theme.colors.sageGreen}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Food')}>
          <Icon
            name="local-dining"
            size={40}
            color={theme.colors.sageGreen}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Display cart items or empty cart message */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.noItemText}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()} // Ensure unique key
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
    padding: 20,
  },
  list: {
    paddingBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    backgroundColor: theme.colors.charcoalBlack,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
    position: 'sticky', // Ensure icons stay at the top when scrolling
    top: 0, // Pin the icons to the top of the screen
    zIndex: 1, // Ensure icons are on top of other content
  },
  icon: {
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  activeIcon: {
    backgroundColor: theme.colors.sageGreen,
    padding: 12,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: theme.colors.pearlWhite,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.outerSpace,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: theme.colors.pearlWhite,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
  },
  removeButton: {
    backgroundColor: theme.colors.sageGreen,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    fontSize: 14,
    color: theme.colors.charcoalBlack,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noItemText: {
    color: theme.colors.ivory,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Cart;
