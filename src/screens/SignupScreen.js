// src/screens/SignupScreen.js
import React from "react";
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "../components/FormInput";
import auth from '@react-native-firebase/auth';
import { storeCredentialsBiometric } from "../services/biometric";
import { useTranslation } from "react-i18next";

const SignupScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const signupSchema = yup.object({
    email: yup.string().trim().email(t("email_invalid")).required(t("email_required")),
    password: yup.string().min(6, t("password_min", { count: 6 })).required(t("password_required")),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password"), null], t("passwords_must_match"))
      .required(t("password_required"))
  }).required();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await auth().createUserWithEmailAndPassword(email, password);
      await storeCredentialsBiometric(email, password);
    } catch (err) {
      Alert.alert(t("create_account"), err.message || t("signup_failed"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("create_account")}</Text>

      <FormInput
        name="email"
        control={control}
        labelKey="email"
        placeholderKey="enter_email"
        keyboardType="email-address"
        autoCapitalize="none" />

      <FormInput
        name="password"
        control={control} 
        labelKey="password" 
        placeholderKey="choose_password" 
        secureTextEntry />

      <FormInput 
      name="confirmPassword" 
      control={control} 
      labelKey="confirm_password"
       placeholderKey="repeat_password" secureTextEntry />

      <View style={{ marginTop: 8 }}>
        {isSubmitting ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button title={t("signup")} onPress={handleSubmit(onSubmit)} />
        )}
      </View>

      <View style={{ height: 12 }} />
      <Button title={t("back_to_login")} onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" }
});


export default SignupScreen;