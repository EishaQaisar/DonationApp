import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
import { useCart } from '../CartContext'; // Import useCart
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon for back arrow
import i18n, { t } from '../i18n'; // Import the translation function

// Optional BackButton component
const BackButton = ({ goBack }) => (
  <TouchableOpacity onPress={goBack} style={styles.backButton}>
    <Icon name="chevron-left" size={20} color={theme.colors.ivory} />
  </TouchableOpacity>
);

const Cart = ({route}) => {
  const { cartItems, removeFromCart } = useCart(); // Access cart context
  const navigation = useNavigation(); // Access navigation object
  const {role} = route.params;
  
  const isUrdu = i18n.locale === "ur";

  // Check if the current route name is "Cart"
  const isCartPage = route.name === 'Cart';

  const renderItem = ({ item }) => {
    // Get the appropriate title based on item category
    let title = '';
    let description = '';
    let category = '';
    let quantity = item.quantity ? item.quantity.toString() : '1';
    
    // Use the item.category to determine what to display
    switch (item.category) {
      case "Food":
        title = item.foodName || '';
        description = item.description || '';
        category = t("titles.food", "Food");
        break;
      case "Clothes":
        if (item.itemCategory === "Shoes") {
          title = t(`clothes.item_category_options.${item.itemCategory}`, { defaultValue: item.itemCategory });
        } else {
          title = t(`clothes.clothes_category_options.${item.clothesCategory}`, { defaultValue: item.clothesCategory });
        }
        description = item.description || '';
        category = t("titles.clothes", "Clothes");
        break;
      case "Education":
        title = item.itemName || '';
        description = item.description || '';
        category = t("titles.education", "Education");
        break;
      default:
        title = item.itemName || item.title || '';
        description = item.description || '';
        category = item.category || '';
    }
  
    return (
      <View style={[styles.itemRow, isUrdu && styles.rtlContainer]}>
        <Image source={item.images[0]} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={[styles.title, isUrdu && styles.urduText]}>{title}</Text>
          <Text style={[styles.description, isUrdu && styles.urduText]}>{description}</Text>
          <Text style={[styles.description, isUrdu && styles.urduText]}>{category}</Text>
          <Text style={[styles.quantity, isUrdu && styles.urduText]}>
            {t("itemDetail.quantity", "Quantity")}: {quantity}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item)} // Pass the item to removeFromCart
        >
          <Text style={[styles.removeButtonText, isUrdu && styles.urduText]}>
            {t("general.remove", "Remove")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, isUrdu && styles.rtlContainer]}>
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
          <Text style={[styles.noItemText, isUrdu && styles.urduText]}>
            {t("cart.emptyCart", "Your cart is empty.")}
          </Text>
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
  rtlContainer: {
    direction: 'rtl',
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
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginBottom: 2,
  },
  quantity: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    fontWeight: '500',
    marginTop: 2,
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
  urduText: {
    fontSize: 16, // Increase font size for Urdu
    fontFamily: 'System', // You might want to use a specific Urdu font if available
  },
});

export default Cart;