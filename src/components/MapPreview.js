import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapPreview = ({ lat, lon }) => {
  if (!lat || !lon) return null;
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        pointerEvents="none"
      >
        <Marker coordinate={{ latitude: lat, longitude: lon }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    margin: 12
  },
  map: { flex: 1 }
});

export default MapPreview;