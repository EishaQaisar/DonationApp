import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import {theme} from '../core/theme';
import { useCart } from '../CartContext';

const Cart = () => {
  console.log("hereCART");

  const { cartItems, removeFromCart } = useCart(); // Access cart context
console.log("here");
console.log(cartItems);
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noItemText}>Your cart is empty.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={item.images[0]} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.foodName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
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
  noItemText: {
    fontSize: 18,
    color: theme.colors.pearlWhite,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Cart;