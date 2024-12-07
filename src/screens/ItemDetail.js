import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../CartContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


const ItemDetail = ({ route, navigation }) => {
    const { item, category} = route.params;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart, isInCart } = useCart();
    const tabBarHeight = useBottomTabBarHeight();


    const isClaimed = isInCart(item);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length
        );
    };

    const renderCategoryDetails = () => {
        switch (category) {
            case 'food':
                return (
                    <View>
                    <Text style={styles.title}> {item.foodName}</Text>

                    <View style={styles.detailsCard}>
                        <DetailItem icon="food" label="Meal" value={item.mealType} />
                        <DetailItem icon="silverware-fork-knife" label="Food Type" value={item.foodType} />
                        <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
                        <DetailItem icon="text-short" label="Description" value={item.description} />
                    </View>
                    </View>
                );
            case 'Clothing':
                return (
                    <View>
                    <Text style={styles.title}>{item.itemName}</Text>
                    <View style={styles.detailsCard}>
                        <DetailItem icon="tshirt-crew" label="Size" value={item.size} />
                        <DetailItem icon="texture-box" label="Fabric" value={item.fabric} />
                        <DetailItem icon="weather-sunny" label="Season" value={item.season} />
                        <DetailItem icon="human-male-child" label="Age" value={item.age_category} />
                        <DetailItem icon="gender-male-female" label="Gender" value={item.gender} />
                        <DetailItem icon="star-outline" label="Condition" value={item.c_condition} />
                        <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
                    </View>
                </View>

                );
            case 'Education':
                return (
                    <View>
                        <Text style={styles.title}>{item.itemName}</Text>
                        <View style={styles.detailsCard}>
                            <DetailItem icon="book-open-variant" label="Subject" value={item.subject} />
                            <DetailItem icon="school" label="Level" value={item.level} />
                            <DetailItem icon="shape-outline" label="Type" value={item.type} />
                            <DetailItem icon="star-outline" label="Condition" value={item.c_condition} />
                            <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
                            <DetailItem icon="text-short" label="Description" value={item.description} />
                            <DetailItem icon="account" label="Donor Username" value={item.donorUsername} />
                        </View>
                    </View>
                );
            default:
                return (
                    <View style={styles.detailsCard}>
                        <Text style={styles.noDetailsText}>No additional details available.</Text>
                    </View>
                );
        }
    };

    return (
        <ScrollView style={[styles.container, {marginBottom:tabBarHeight}]}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={handlePreviousImage} style={styles.navButton}>
                    <Icon name="chevron-left" size={20} color={theme.colors.ivory} />
                </TouchableOpacity>
                <Image source={item.images[currentImageIndex]} style={styles.image} />
                <TouchableOpacity onPress={handleNextImage} style={styles.navButton}>
                    <Icon name="chevron-right" size={20} color={theme.colors.ivory} />
                </TouchableOpacity>
            </View>


            {renderCategoryDetails()}

            <TouchableOpacity
                style={[styles.claimButton, isClaimed && styles.disabledClaimButton]}
                onPress={() => !isClaimed && addToCart(item)}
                disabled={isClaimed}
            >
                <Text style={styles.claimButtonText}>
                    {isClaimed ? 'Claimed' : 'Claim Item'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
        <MaterialIcon name={icon} size={24} color={theme.colors.sageGreen} style={styles.detailIcon} />
        <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.charcoalBlack,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 28,
        color: theme.colors.pearlWhite,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    detailsCard: {
        backgroundColor: theme.colors.TaupeBlack,
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailIcon: {
        marginRight: 15,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 16,
        color: theme.colors.ivory,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 18,
        color: theme.colors.pearlWhite,
        fontWeight: '500',
    },
    noDetailsText: {
        fontSize: 16,
        color: theme.colors.ivory,
        textAlign: 'center',
    },
    claimButton: {
        backgroundColor: theme.colors.sageGreen,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 30,
        alignItems: 'center',
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

