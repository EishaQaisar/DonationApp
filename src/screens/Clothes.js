import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../core/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CartContext } from '../CartContext';

const clothesItems = [
    {
        id: '1',
        images: [
            require('../../assets/items/cloth1.jpg'),
            require('../../assets/items/cloth2.jpg'),
            require('../../assets/items/clothes.jpg'),
        ],
        title: 'T-Shirt',
        description: 'Comfortable cotton t-shirts in different colors.',
    },
    {
        id: '2',
        images: [
            require('../../assets/items/cloth1.jpg'),
            require('../../assets/items/cloth2.jpg'),
            require('../../assets/items/clothes.jpg'),
        ],
        title: 'Jeans',
        description: 'Stylish and durable jeans in various sizes.',
    },
    {
        id: '3',
        images: [
            require('../../assets/items/cloth1.jpg'),
            require('../../assets/items/cloth2.jpg'),
            require('../../assets/items/clothes.jpg'),
        ],
        title: 'Jacket',
        description: 'Warm jackets for the winter season.',
    },
    {
        id: '4',
        images: [
            require('../../assets/items/cloth1.jpg'),
            require('../../assets/items/cloth2.jpg'),
            require('../../assets/items/clothes.jpg'),
        ],
        title: 'Dress',
        description: 'Elegant dresses for special occasions.',
    },
];

const Clothes = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isInCart } = useContext(CartContext);

    // Filter out items that are already in the cart
    const visibleItems = clothesItems.filter(item => !isInCart(item));

    const renderItem = ({ item }) => (
        <View style={styles.donationItem}>
            {/* Display the first image */}
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

    // Check if the current route name is "Clothes"
    const isClothesPage = route.name === 'Clothes';

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
                                    color={theme.colors.sageGreen}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Clothes')}>
                                <Icon
                                    name="checkroom"
                                    size={40}
                                    color={isClothesPage ? theme.colors.ivory : theme.colors.sageGreen}
                                    style={[styles.icon, isClothesPage && styles.activeIcon]}
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
                            <Text style={styles.title}>Clothes Donations</Text>
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
        backgroundColor:'#2E2E2E',
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

export default Clothes;
