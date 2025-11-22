// src/screens/EventDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getEventById } from "../api/eventsApi";
import MapPreview from "../components/MapPreview";
import FavoriteButton from "../components/FavoriteButton";
import useFavorites from "../hooks/useFavorites";
import formatDate from "../utils/formatDate";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 260;

const EventDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    (async () => {
      const data = await getEventById(id);
      setEvent(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const images = event.images || [];
  const venue = event._embedded?.venues?.[0] || {};
  const dateText = formatDate(event.dates?.start?.dateTime);
  const description = event.info || event.description || event.pleaseNote || "No description available.";

  const venueAddress = [
    venue?.address?.line1,
    venue?.city?.name,
    venue?.state?.name,
    venue?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const lat = Number(venue?.location?.latitude);
  const lon = Number(venue?.location?.longitude);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}>
          {images.length ? (
            images.map((img, i) => (
              <Image 
                 key={i} 
                 source={{ uri: img.url }} 
                 style={styles.headerImage} />
            ))
          ) : (
            <View style={[styles.headerImage, styles.headerPlaceholder]}>
              <Text>No image</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{Platform.OS === "ios" ? "‹ Back" : "← Back"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom:50 }}>
        <Text style={styles.title}>{event.name}</Text>

        <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
          <FavoriteButton
            isFav={isFavorite(event.id)}
            onPress={() =>
              toggleFavorite({
                id: event.id,
                name: event.name,
                venue: venue?.name,
                date: event.dates?.start?.dateTime,
                images: event.images,
              })
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>When</Text>
          <Text style={styles.text}>{dateText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Where</Text>
          <Text style={styles.text}>{venue?.name || "Unknown venue"}</Text>
          <Text style={styles.text}>{venueAddress || "No address available"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.text}>{description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Map</Text>
        {lat && lon ? (
          <MapPreview lat={lat} lon={lon} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.text}>Location not available.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { height: HEADER_HEIGHT, backgroundColor: "#000" },
  headerImage: { width: width, height: HEADER_HEIGHT },
  headerPlaceholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },

  backBtn: {
    position: "absolute",
    top: 16,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#0007",
    borderRadius: 6,
    marginTop:50
  },
  backText: { color: "white", fontSize: 14 },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },

  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },

  text: { fontSize: 14, color: "#333", lineHeight: 20 },

  linkCard: {
    alignItems: "center",
  },
  linkText: { color: "#0b69ff", fontWeight: "700" },
});

export default EventDetailsScreen