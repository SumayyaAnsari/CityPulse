// src/components/FormInput.js
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, I18nManager, Image } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FormInput = ({
  control,
  name,
  label,
  labelKey,
  placeholder,
  placeholderKey,
  rules = {},
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onSubmitEditing,
  style,
}) => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  const labelText = labelKey ? t(labelKey) : label;
  const placeholderText = placeholderKey ? t(placeholderKey) : placeholder;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {labelText ? <Text style={[styles.label, i18n.dir() === "rtl" && styles.rtlText]}>{labelText}</Text> : null}

          <View style={[styles.inputWrapper, error && styles.errorBorder]}>
            <TextInput
              style={[styles.input, i18n.dir() === "rtl" && styles.rtlInput]}
              placeholder={placeholderText}
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={secureTextEntry && !visible}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              textAlign={i18n.dir() === "rtl" ? "right" : "left"}
            />

            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setVisible(!visible)}
                style={styles.eyeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image
                  source={
                    visible
                      ? require("../assets/images/eye.png")  
                      : require("../assets/images/hidden.png") 
                  }
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

          </View>

          {error && <Text style={[styles.errorText, i18n.dir() === "rtl" && styles.rtlText]}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#111",
  },
  rtlInput: {
    writingDirection: "rtl"
  },
  eyeIcon: { width: 25,height:25 },
  errorBorder: { borderColor: "#d32f2f" },
  rtlText: { writingDirection: "rtl" }
});



export default FormInput;