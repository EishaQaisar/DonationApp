import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    // Daily Havit inspired color scheme (keeping same property names)
    charcoalBlack: '#FFFFFF',  // Pure white background - clean and minimal
    sageGreen: '#2A5D4B',      // Forest green - primary brand color
    copper: '#9DDBC8',         // Mint green - secondary accent color
    pearlWhite: "#FFFFFF",     // Pure white - for cards and surfaces
    ivory: 'black',          // Off-white - subtle background variation 
    outerSpace: '#E8F3EF',     // Very light mint - for highlights and sections
    TaupeBlack: '#333333',     // Dark gray - for primary text
    
    // Standard theme colors mapped to Daily Havit scheme
    text: "#333333",           // Dark gray for readable text
    primary: "#2A5D4B",        // Forest green for primary actions and branding
    secondary: "#9DDBC8",      // Mint green for accents and highlights
    background: "#FFFFFF",     // White for clean backgrounds
    surface: "#FFFFFF",        // White for cards and surfaces
    error: "#D64045",          // Muted red that works with the palette
    placeholder: '#8A8F8D',    // Medium gray for placeholders and hints
  },
  
  // Additional customization to match Daily Havit
  roundness: 16,               // Rounded corners for buttons and cards
};