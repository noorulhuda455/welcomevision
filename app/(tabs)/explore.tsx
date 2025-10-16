// app/(tabs)/explore.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function InfoScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#1e40af"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>
              <Text style={styles.headerGradient}>About</Text> WelcomeVision
            </Text>

            {/* App Info Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>What is WelcomeVision?</Text>
              <Text style={styles.cardText}>
                WelcomeVision is a smart patient experience platform that uses location technology
                to enhance your clinic visit. The app automatically detects when you arrive and
                leave, helping us provide better service.
              </Text>
            </View>

            {/* Features Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Features</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>📍</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Automatic Check-in</Text>
                  <Text style={styles.featureText}>
                    Get notified when you arrive at the clinic
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>📝</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Pre-Visit Notes</Text>
                  <Text style={styles.featureText}>
                    Share how you're feeling before your appointment
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>⭐</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Feedback System</Text>
                  <Text style={styles.featureText}>
                    Help us improve with your ratings and comments
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>📊</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Visit History</Text>
                  <Text style={styles.featureText}>
                    Track all your past visits and feedback
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Privacy & Permissions</Text>
              <Text style={styles.cardText}>
                This app requires location permissions to detect when you arrive at the clinic.
                Your location data is only used for this purpose and is never shared with third parties.
              </Text>
            </View>

            {/* Contact Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Need Help?</Text>
              <Text style={styles.cardText}>
                If you have questions or need assistance, please contact our front desk staff.
              </Text>
            </View>

            {/* Version Info */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>WelcomeVision v1.0.0</Text>
              <Text style={styles.versionSubtext}>Patient Experience Platform</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  headerGradient: {
    color: "#3b9eff",
  },
  card: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: "#bfdbfe",
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  featureBullet: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: "#93c5fd",
    lineHeight: 20,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60a5fa",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: "#93c5fd",
  },
});
