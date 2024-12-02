import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from '../CartContext'; // Correct path

const ItemDetail = ({ route, navigation }) => {
    const { item } = route.params; // Ensure 'item' is passed correctly
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image
    const { addToCart, isInCart } = useCart(); // Access context functions

    const isClaimed = isInCart(item);

    const goToCart = () => {
        navigation.navigate('Cart');
    };

    // Function to handle image swipe
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length
        );
    };

    return (
        <View style={styles.container}>
            {/* Cart Icon */}
            {/* <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
                <Icon name="shopping-cart" size={30} color={theme.colors.ivory} />
            </TouchableOpacity> */}

            {/* Swipeable Image */}
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={handlePreviousImage} style={styles.navButton}>
                    <Icon name="chevron-left" size={20} color={theme.colors.ivory} />
                </TouchableOpacity>
                <Image source={item.images[currentImageIndex]} style={styles.image} />
                <TouchableOpacity onPress={handleNextImage} style={styles.navButton}>
                    <Icon name="chevron-right" size={20} color={theme.colors.ivory} />
                </TouchableOpacity>
            </View>

            {/* Item Details */}
            <Text style={styles.title}>{item.foodName}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Claim Button */}
            <TouchableOpacity
                style={[styles.claimButton, isClaimed && styles.disabledClaimButton]}
                onPress={() => !isClaimed && addToCart(item)}
                disabled={isClaimed}
            >
                <Text style={styles.claimButtonText}>
                    {isClaimed ? 'Claimed' : 'Claim Item'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.charcoalBlack,
        padding: 20,
        alignItems: 'center',
    },
    cartIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    navButton: {
        padding: 10,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: theme.colors.pearlWhite,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        color: theme.colors.pearlWhite,
        textAlign: 'center',
        marginBottom: 20,
    },
    claimButton: {
        backgroundColor: theme.colors.sageGreen,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    disabledClaimButton: {
        backgroundColor: theme.colors.outerSpace,
    },
    claimButtonText: {
        fontSize: 18,
        color: theme.colors.ivory,
        fontWeight: 'bold',
    },
});

export default ItemDetail;
