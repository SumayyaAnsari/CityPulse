import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../theme/colors";
import formatDate from "../utils/formatDate";

const EventCard = ({ event, onPress, rightComponent }) => {
  const image = event.images?.[0]?.url;
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(event)}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.placeholder} />}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.name}</Text>
        <Text style={styles.meta}>{event.venue} • {formatDate(event.date)}</Text>
      </View>
      <View style={styles.right}>{rightComponent}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 2,
    padding: 8,
    alignItems: "center"
  },
  image: 
  { width: 80, 
    height: 80, 
    borderRadius: 8 
  },

  placeholder: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
  content: { flex: 1, paddingHorizontal: 10 },
  title: { fontSize: 16, fontWeight: "600", color: colors.text },
  meta: { fontSize: 12, color: colors.muted, marginTop: 6 },
  right: { marginLeft: 6 }
});


export default EventCard;
