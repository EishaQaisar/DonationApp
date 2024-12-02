import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../core/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CartContext } from '../CartContext'; // Correct import

const educationItems = [
    {
        id: '1',
        images: [
            require('../../assets/items/STATIONARY.jpg'),
            require('../../assets/items/D1.jpg'),
            require('../../assets/items/STATIONARY.jpg'),
        ],
        title: 'Textbooks',
        description: 'Useful textbooks for various subjects.',
    },
    {
        id: '2',
        images: [
            require('../../assets/items/STATIONARY.jpg'),
            require('../../assets/items/STATIONARY.jpg'),
            require('../../assets/items/STATIONARY.jpg'),
        ],
        title: 'Notebooks',
        description: 'High-quality notebooks for students.',
    },
    {
        id: '3',
        images: [
            require('../../assets/items/STATIONARY.jpg'),
            require('../../assets/items/STATIONARY.jpg'),
            require('../../assets/items/STATIONARY.jpg'),
        ],
        title: 'Pens and Pencils',
        description: 'Reliable pens and pencils for everyday use.',
    },
];

const Education = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isInCart } = useContext(CartContext);

    // Filter out items that are already in the cart
    const visibleItems = educationItems.filter(item => !isInCart(item));

    const renderItem = ({ item }) => (
        <View style={styles.donationItem}>
            {/* Display only the first image */}
            <Image source={item.images[0]} style={styles.itemImage} />
            <Text style={styles.item}>{item.title}</Text>
            <TouchableOpacity
                style={styles.claimButton}
                onPress={() => navigation.navigate('ItemDetail', { item })}
            >
                <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
        </View>
    );

    // Check if the current route name is "Education"
    const isEducationPage = route.name === 'Education';

    return (
        <View style={styles.container}>
            <FlatList
                data={visibleItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                ListHeaderComponent={
                    <>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Education')}>
                                <Icon
                                    name="school"
                                    size={40}
                                    color={isEducationPage ? theme.colors.ivory : theme.colors.sageGreen}
                                    style={[styles.icon, isEducationPage && styles.activeIcon]}
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
                        <View style={styles.header}>
                            <Text style={styles.title}>Education Donations</Text>
                        </View>
                    </>
                }
            />
        </View>
    );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 28,
    color: theme.colors.ivory,
    fontWeight: 'bold',
  },
  grid: {
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
  },
  donationItem: {
    backgroundColor: theme.colors.TaupeBlack,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '45%',
    alignItems: 'center',
    marginHorizontal: '2.5%',
    shadowColor: theme.colors.sageGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.sageGreen,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderColor: theme.colors.sageGreen,
    borderWidth: 3,
    marginBottom: 10,
  },
  item: {
    fontSize: 20,
    color: theme.colors.ivory,
    textAlign: 'center',
    marginBottom: 10,
  },
  claimButton: {
    backgroundColor: theme.colors.charcoalBlack,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: theme.colors.sageGreen,
    borderBottomWidth: 8,
    borderWidth: 3,
    borderRadius: 20,
    marginTop: 10,
  },
  claimButtonText: {
    fontSize: 18,
    color: theme.colors.ivory,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    backgroundColor: theme.colors.charcoalBlack,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.sageGreen,
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
});

export default Education;
