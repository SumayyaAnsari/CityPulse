import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const LanguageSwitch = ({ current, onChange }) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onChange("en")} style={[styles.btn, current === "en" && styles.active]}>
        <Text>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("ar")} style={[styles.btn, current === "ar" && styles.active]}>
        <Text>ع</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 4
  },
  active: { backgroundColor: "#eee" }
});
export default  LanguageSwitch;