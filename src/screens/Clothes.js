import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../core/theme';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CartContext } from '../CartContext';
import axios from 'axios';
import { getBaseUrl } from '../helpers/deviceDetection';

const Clothes = ({ route }) => {
    const navigation = useNavigation();
    const { role } = route.params;  // Get the 'role' passed from the previous screen

    const { isInCart } = useContext(CartContext);
    const [clothesItems, setClothesItems] = useState([]);

    // Fetch clothes donations from the API
    const fetchClothesDonations = async () => {
        try {
            const BASE_URL = await getBaseUrl();
            const response = await axios.get(`${BASE_URL}/api/clothes-donations`);
            const data = response.data.map(item => {
                const parsedImages = item.images ? JSON.parse(item.images) : [];
                const validImages = parsedImages.map(imagePath => ({ uri: imagePath }));
                return {
                    ...item,
                    images: validImages,
                };
            });
            setClothesItems(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchClothesDonations();
    }, []);

    useEffect(() => {
        console.log("clothes items updated:", clothesItems);
    }, [clothesItems]);

    const visibleItems = clothesItems.filter(item => !isInCart(item));

    // Render each item in the list
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.donationItem}
            onPress={() => navigation.navigate('ItemDetail', { item, category: 'Clothes' })}
        >
            <Image source={item.images[0]} style={styles.itemImage} />
            <Text style={styles.item}>{item.title}</Text>
            <TouchableOpacity
                style={styles.claimButton}
                onPress={() => navigation.navigate('ItemDetail', { item, category: 'Clothes' })}
            >
                {/* Conditionally change the button text based on the user role */}
                <Text style={styles.claimButtonText}>
                    {role === 'donor' ? 'View' : 'Claim'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

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

export default Clothes;
