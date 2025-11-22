import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "cp_favorites";
const LANGUAGE_KEY = "cp_language";

export const saveFavorites = async (list) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
};

export const loadFavorites = async () => {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveLanguage = async (lang) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
};

export const loadLanguage = async () => {
  const v = await AsyncStorage.getItem(LANGUAGE_KEY);
  return v || "en";
};

