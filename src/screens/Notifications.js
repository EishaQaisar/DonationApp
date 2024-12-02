// src/screens/recipient/Notifications.js

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from "../core/theme";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Notifications = () => {
  // Dummy data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Donation Approved',
      description: 'Your request for clothes has been approved.',
      timestamp: 'Nov 23, 2024, 10:00 AM',
    },
    {
      id: '2',
      title: 'Delivery Scheduled',
      description: 'Your delivery for food items is scheduled for Nov 24, 2024.',
      timestamp: 'Nov 22, 2024, 2:30 PM',
    },
    {
      id: '3',
      title: 'New Campaign Available',
      description: 'A new education campaign is now available for you.',
      timestamp: 'Nov 21, 2024, 8:00 AM',
    },
  ]);

  // Function to handle clearing notifications
  const clearNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => clearNotification(item.id)}
      >
        <Icon name="clear" size={20} color={theme.colors.ivory} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No new notifications</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.charcoalBlack,
  },
  heading: {
    color: theme.colors.ivory,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },
  listContainer: {
    padding: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.outerSpace,
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: theme.colors.ivory,
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: theme.colors.pearlWhite,
    fontSize: 14,
    marginTop: 5,
  },
  timestamp: {
    color: theme.colors.sageGreen,
    fontSize: 12,
    marginTop: 5,
  },
  clearButton: {
    backgroundColor: theme.colors.sageGreen,
    borderRadius: 5,
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.pearlWhite,
    fontSize: 16,
  },
});

export default Notifications;