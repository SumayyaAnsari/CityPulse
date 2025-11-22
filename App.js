import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { NavigationContainer } from "@react-navigation/native";
import i18n from "./src/i18n";
import AppNavigator from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { loadLanguage } from "./src/services/storage";
import auth from "@react-native-firebase/auth";
import { getCredentialsBiometric } from "./src/services/biometric";
import SplashScreen from "./src/screens/SplashScreen";

const App = () => {
  const [langReady, setLangReady] = useState(false);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const lang = await loadLanguage();
        if (lang && i18n.language !== lang) {
          await i18n.changeLanguage(lang);
        }
      } catch (e) {
      } finally {
        setLangReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  useEffect(() => {
    (async () => {
      if (!initializing && !user) {
        try {
          const creds = await getCredentialsBiometric();
          if (creds && creds.email && creds.password) {
            await auth().signInWithEmailAndPassword(creds.email, creds.password);
          }
        } catch (e) { }
      }
    })();
  }, [initializing, user]);

  if (!langReady || initializing) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <AppNavigator user={user} />
          </NavigationContainer>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
export default App;