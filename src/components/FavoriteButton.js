import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

const FavoriteButton = ({ isFav, onPress }) => {
  return (
    <TouchableOpacity style={[styles.btn, isFav ? styles.active : null]} onPress={onPress}>
      <Text
      style={[styles.text, isFav ? styles.textActive : null]}>{
        isFav ? "★" : "☆"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 38
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  text: { fontSize: 18, color: colors.muted },
  textActive: { color: "white" }
});


export default FavoriteButton;