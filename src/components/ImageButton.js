import { Image, Pressable, Text, StyleSheet } from 'react-native';

export default function ImageButton({ onPress, source, imageStyle, text, textStyle }) {
  return (
      <Pressable
        onPress={onPress} 
        style={({ pressed }) => [
          styles.row, 
          pressed ? styles.pressed : styles.notPressed
        ]}
      >
        <Image style={imageStyle} source={source} />
        
        {/* Wrap text in `${text || ''}` to ensure it’s rendered as a string */}
        <Text style={[styles.text, textStyle]}>
          {text ? `${text}` : 'Button'}
        </Text>
      </Pressable>
  );
}
////yahan per button aur text k dermayan main space change kerni.
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
        width: "100%",
        maxWidth: 340,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        opacity: 0,
    },
    notPressed: {
        opacity: 1,
    },
    row: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        margin: 7,
        fontSize: 16,
        color:'white'
    },
});
