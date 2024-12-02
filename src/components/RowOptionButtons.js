import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from "../core/theme";

const RowOptionButtons = ({ options, selectedValue, onSelect, heading }) => {
  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.headings}>{heading}</Text>
      <View style={styles.buttonContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              selectedValue === option && styles.selectedButton
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.ivory,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    borderRadius: 5,
    width: '22%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: theme.colors.sageGreen,
  },
  buttonText: {
    color: theme.colors.ivory,
    fontWeight: 'bold',
  },
});

export default RowOptionButtons;
