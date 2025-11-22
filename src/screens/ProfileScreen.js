// src/screens/ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  I18nManager
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../services/logout";
import useFavorites from "../hooks/useFavorites";
import { saveLanguage } from "../services/storage";
import RNRestart from "react-native-restart";  

const ProfileScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const user = auth().currentUser || {};
  const { favorites } = useFavorites();
  const [lang, setLang] = useState(i18n.language || "en");

  const applyLanguageChange = async (lng) => {
    if (lng === lang) return;
    setLang(lng);
    i18n.changeLanguage(lng);
    await saveLanguage(lng);
    

    const wantRTL = lng === "ar";
    if (I18nManager.isRTL !== wantRTL) {
      I18nManager.allowRTL(wantRTL);
      I18nManager.forceRTL(wantRTL);

      RNRestart.Restart();
    }
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
            const ok = await logoutUser();
            if (ok) navigation.replace("Login");
          }
        }
      ]
    );
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favRow}
      onPress={() => navigation.navigate("Details", { id: item.id, event: item })}
    >
      <Image
        source={
          item.images?.[0]?.url
            ? { uri: item.images[0].url }
            : require("../assets/images/profile.png")
        }
        style={styles.favImage}
      />

      <View style={styles.favInfo}>
        <Text style={styles.favTitle}>{item.name}</Text>
      </View>

    
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>
          {user.displayName || user.email?.split("@")[0] || t("user")}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("language")}</Text>

        <View style={styles.langRow}>
          <TouchableOpacity
            style={[styles.langBtn, lang === "en" && styles.langActive]}
            onPress={() => applyLanguageChange("en")}
          >
            <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, lang === "ar" && styles.langActive]}
            onPress={() => applyLanguageChange("ar")}
          >
            <Text style={[styles.langText, lang === "ar" && styles.langTextActive]}>ع</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { flex: 1 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{t("favorites")}</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyFav}>
            <Text style={styles.emptyText}>{t("no_favorites")}</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavorite}
          />
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb", padding: 12 },

  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: "#e4ecff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  avatarText: { fontSize: 34, fontWeight: "bold", color: "#0b69ff" },

  userName: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10
  },

  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  langRow: { flexDirection: "row" },
  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#d9dce3",
    marginRight: 10
  },
  langActive: { backgroundColor: "#0b69ff", borderColor: "#0b69ff" },
  langText: { fontWeight: "bold", color: "#333" },
  langTextActive: { color: "#fff" },

  favRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  favImage: { width: 50, height: 50, borderRadius: 6, backgroundColor: "#eee" },
  favInfo: { flex: 1, marginLeft: 10 },
  favTitle: { fontSize: 15, fontWeight: "600" },
  favMeta: { fontSize: 12, color: "#777" },

  arrowIcon: { width: 16, height: 16, tintColor: "#999" },

  emptyFav: { alignItems: "center", padding: 20 },
  emptyText: { color: "#777" },

  logoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom:30,
    marginHorizontal:20,
  },
  logoutText: { color: "#fff", fontWeight: "700" }
});
export default  ProfileScreen;
