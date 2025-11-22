// src/screens/LoginScreen.js
import React from "react";
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "../components/FormInput";
import auth from '@react-native-firebase/auth';
import { storeCredentialsBiometric } from "../services/biometric";
import { useTranslation } from "react-i18next";

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const loginSchema = yup.object({
    email: yup.string().trim().email(t("email_invalid")).required(t("email_required")),
    password: yup.string().min(6, t("password_min", { count: 6 })).required(t("password_required"))
  }).required();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await auth().signInWithEmailAndPassword(email, password);
      await storeCredentialsBiometric(email, password);
    } catch (err) {
      Alert.alert(t("sign_in"), err.message || t("login_failed") || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("sign_in")}</Text>

      <FormInput
        name="email"
        control={control}
        labelKey="email"
        placeholderKey="enter_email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormInput
        name="password"
        control={control}
        labelKey="password"
        placeholderKey="enter_password"
        secureTextEntry
      />

      <View style={{ marginTop: 8 }}>
        {isSubmitting ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button title={t("login")} onPress={handleSubmit(onSubmit)} />
        )}
      </View>

      <View style={{ height: 12 }} />
      <Button title={t("create_account")} onPress={() => navigation.navigate("Signup")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 24, textAlign: "center" }
});


export default LoginScreen
