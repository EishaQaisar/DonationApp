import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../core/theme';

const ClaimsHistory = () => {
  // Sample data for claims
  const claimsData = [
    { id: '1', title: 'Winter Clothes', date: '2024-10-01' },
    { id: '2', title: 'Books', date: '2024-09-15' },
    { id: '3', title: 'Toys', date: '2024-08-22' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Claims History</Text>
      <FlatList
        data={claimsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.claimItem}>
            <Text style={styles.claimTitle}>{item.title}</Text>
            <Text style={styles.claimDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ivory,
    marginBottom: 20,
  },
  claimItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.sageGreen,
    marginBottom: 10,
    shadowColor: theme.colors.charcoalBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  claimTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.ivory,
  },
  claimDate: {
    fontSize: 14,
    color: theme.colors.pearlWhite,
    marginTop: 5,
  },
});

export default ClaimsHistory;
