import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../theme/colors";

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const t = setTimeout(() => navigation.replace("Home"), 500);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>City Pulse</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 28, fontWeight: "700", marginBottom: 12 }
});
