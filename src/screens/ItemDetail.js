import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../CartContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const ItemDetail = ({ route }) => {
    const { item, category, role } = route.params; // Assuming userRole is passed in route params
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart, isInCart } = useCart();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();

    const isClaimed = isInCart(item);

    // Normalize userRole to handle case variations
    const isDonor = role && role.toLowerCase() === 'donor';  // Checks if user is a donor

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
            case 'Food':
                return (
                    <View>
                        <Text style={styles.title}>{item.foodName}</Text>
                        <View style={styles.detailsCard}>
                            <DetailItem icon="food" label="Meal" value={item.mealType} />
                            <DetailItem icon="silverware-fork-knife" label="Food Type" value={item.foodType} />
                            <DetailItem icon="numeric" label="Quantity" value={item.quantity.toString()} />
                            <DetailItem icon="text-short" label="Description" value={item.description} />
                        </View>
                    </View>
                );
            case 'Clothes':
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

    const showConfirmationModal = () => {
        setIsModalVisible(true);
    };

    const hideConfirmationModal = () => {
        setIsModalVisible(false);
    };

    const confirmClaimItem = () => {
        addToCart(item); // Add to cart if confirmed
        setIsModalVisible(false);
    };

    return (
        <ScrollView style={[styles.container, { marginBottom: tabBarHeight }]}>
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

            {/* Only show claim button if user is NOT a donor */}
            {!isDonor && (
                <TouchableOpacity
                    style={[styles.claimButton, isClaimed && styles.disabledClaimButton]}
                    onPress={() => !isClaimed && showConfirmationModal()}
                    disabled={isClaimed}
                >
                    <Text style={styles.claimButtonText}>
                        {isClaimed ? 'Claimed' : 'Claim Item'}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Custom Confirmation Modal */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={hideConfirmationModal}
            >
                <TouchableWithoutFeedback onPress={hideConfirmationModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Confirm Claim</Text>
                                <Text style={styles.modalMessage}>
                                    Are you sure you want to claim this item?
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={hideConfirmationModal}
                                    >
                                        <Text style={styles.modalButtonText}>No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.confirmButton]}
                                        onPress={confirmClaimItem}
                                    >
                                        <Text style={styles.modalButtonText}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: 300,
        backgroundColor: theme.colors.charcoalBlack,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 24,
        color: theme.colors.pearlWhite,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 18,
        color: theme.colors.ivory,
        textAlign: 'center',
        marginBottom: 25,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: theme.colors.outerSpace,
    },
    confirmButton: {
        backgroundColor: theme.colors.sageGreen,
    },
    modalButtonText: {
        fontSize: 18,
        color: theme.colors.ivory,
        fontWeight: 'bold',
    },
});

export default ItemDetail;
