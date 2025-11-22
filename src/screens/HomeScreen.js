// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native";
import useEvents from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import FavoriteButton from "../components/FavoriteButton";
import useFavorites from "../hooks/useFavorites";
import { useTranslation } from "react-i18next";
import colors from "../theme/colors";
import { FloatingAction } from "react-native-floating-action";
import { logoutUser } from "../services/logout";

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const actions = [
    {
      text: t("profile"),
      icon: require("../assets/images/profile.png"),
      name: "bt_profile",
      position: 1
    },
    {
      text: t("logout"),
      icon: require("../assets/images/logout.png"),
      name: "bt_logout",
      position: 2
    }
  ];

  const { events, loading, fetch } = useEvents();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");

  const onSearch = async () => {
    await fetch({ keyword, city });
  };

  const handleLogout = async () => {
    Alert.alert(
      t("logout"),
      t("logout_confirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("logout"),
          style: "destructive",
          onPress: async () => {
            await logoutUser();
          }
        }
      ]
    );
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  useEffect(() => {
    fetch({ keyword: "Party", city: "New York" });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder={t("search_placeholder")}
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <TextInput
          placeholder={t("search_city")}
          value={city}
          onChangeText={setCity}
          style={[styles.input, styles.cityInput]}
        />
        <TouchableOpacity
          onPress={onSearch}
          style={styles.searchButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={styles.searchButtonText}>{t("search_button")}</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loading}>{t("loading")}</Text>}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate("Details", { id: item.id, event: item })}
            rightComponent={
              <FavoriteButton isFav={isFavorite(item.id)} onPress={() => toggleFavorite(item)} />
            }
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>{t("no_results")}</Text>}
      />

      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          if (name === "bt_logout") {
            handleLogout();
          } else if (name === "bt_profile") {
            goToProfile();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: { padding: 12, flexDirection: "row" },
  input: { fontSize: 12, flex: 1, padding: 10, borderColor: "#ddd", borderWidth: 1, borderRadius: 8, marginRight: 8 },
  cityInput: { maxWidth: 120 },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 6,
    minWidth: 80,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButtonText: { color: "white", fontWeight: "600" },
  buttons: { paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  loading: { textAlign: "center", marginTop: 10 },
  empty: { textAlign: "center", marginTop: 20, color: colors.muted }
});

export default HomeScreen;
