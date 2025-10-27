// app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { StorageService, type Visit } from "../../utils/storage";
import { FeedbackModal } from "../../components/feedback-modal";
import { ConfirmationModal } from "../../components/confirmation-modal";
import { AlertModal } from "../../components/alert-modal";

// Import the task definition (includes GEOFENCE_TASK export)
import { GEOFENCE_TASK } from "../../tasks/geofence";

const CLINIC = {
  id: "clinic-nyc-001",
  name: "Your Ophthalmology Clinic",
  latitude: 40.7561,
  longitude: -73.9869,
  radius: 150,
};

export default function HomeScreen() {
  const [mood, setMood] = useState("");
  const [comment, setComment] = useState("");
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackVisitId, setFeedbackVisitId] = useState<string | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Helper function to show alert
  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Load active visit
  const loadActiveVisit = async () => {
    try {
      const visit = await StorageService.getActiveVisit();
      setActiveVisit(visit);
      if (visit?.mood) setMood(visit.mood);
      if (visit?.comment) setComment(visit.comment);
    } catch (error) {
      console.error("Error loading active visit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Setup permissions and geofencing
  useEffect(() => {
    (async () => {
      try {
        // Request permissions
        const foreground = await Location.requestForegroundPermissionsAsync();
        const background = await Location.requestBackgroundPermissionsAsync();
        await Notifications.requestPermissionsAsync();

        if (!foreground.granted || !background.granted) {
          showAlert(
            "Location Required",
            "This app needs location access to detect when you arrive at the clinic."
          );
        }

        // Setup geofencing
        const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
        if (!started) {
          await Location.startGeofencingAsync(GEOFENCE_TASK, [
            {
              identifier: CLINIC.id,
              latitude: CLINIC.latitude,
              longitude: CLINIC.longitude,
              radius: CLINIC.radius,
              notifyOnEnter: true,
              notifyOnExit: true,
            },
          ]);
        }

        // Setup notification listener for feedback requests
        const subscription = Notifications.addNotificationResponseReceivedListener(
          (response) => {
            const data = response.notification.request.content.data;
            if (data.type === "feedback_request" && data.visitId) {
              setFeedbackVisitId(data.visitId as string);
              setFeedbackModalVisible(true);
            }
          }
        );

        return () => subscription.remove();
      } catch (error) {
        console.error("Setup error:", error);
      }
    })();
  }, []);

  // Reload on focus
  useFocusEffect(
    useCallback(() => {
      loadActiveVisit();
    }, [])
  );

  const saveNote = async () => {
    if (!mood.trim()) {
      showAlert("Missing Info", "Please tell us how you're feeling");
      return;
    }

    setSaving(true);
    try {
      if (activeVisit) {
        // Update existing visit
        const updated = { ...activeVisit, mood, comment };
        await StorageService.setActiveVisit(updated);
        setActiveVisit(updated);
        showAlert("Updated", "Your note has been updated.");
      } else {
        // Create new visit
        const visit = StorageService.createVisit(mood, comment);
        await StorageService.setActiveVisit(visit);
        setActiveVisit(visit);
        showAlert("Saved", "Your note has been saved.");
      }
    } catch {
      showAlert("Error", "Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const staffCloseCase = () => {
    if (!activeVisit) return;
    setConfirmationVisible(true);
  };

  const handleConfirmCloseVisit = async () => {
    if (!activeVisit) return;

    setConfirmationVisible(false);

    try {
      // Save to history
      const completedVisit = {
        ...activeVisit,
        exitedAt: Date.now(),
      };
      await StorageService.addVisit(completedVisit);
      await StorageService.clearActiveVisit();

      // Reset state
      setActiveVisit(null);
      setMood("");
      setComment("");

      // Show feedback modal
      setFeedbackVisitId(completedVisit.id);
      setFeedbackModalVisible(true);
    } catch {
      showAlert("Error", "Failed to close visit.");
    }
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#1e40af"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                <Text style={styles.titleGradient}>Welcome</Text>Vision
              </Text>
              <Text style={styles.subtitle}>Patient Experience Platform ✨</Text>
            </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>Visit Status</Text>
            {activeVisit ? (
              <View style={styles.statusBadgeActive}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active Visit</Text>
              </View>
            ) : (
              <View style={styles.statusBadgeInactive}>
                <Text style={styles.statusText}>No Active Visit</Text>
              </View>
            )}
          </View>

          {activeVisit && (
            <View style={styles.visitInfo}>
              <Text style={styles.visitInfoText}>
                Checked in at {new Date(activeVisit.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>

        {/* Pre-Visit Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-Visit Notes</Text>
          <Text style={styles.sectionDescription}>
            Let us know how you&apos;re feeling before your appointment
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>How are you feeling?</Text>
            <TextInput
              value={mood}
              onChangeText={setMood}
              placeholder="e.g., Eyes feel dry, blurry vision..."
              placeholderTextColor="#7a8fb3"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Additional comments</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Anything else we should know?"
              placeholderTextColor="#7a8fb3"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, saving && styles.buttonDisabled]}
            onPress={saveNote}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : activeVisit ? "Update Note" : "Save Note"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Close Option */}
        {activeVisit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manually End Visit</Text>
            <Text style={styles.sectionDescription}>
              If you're leaving and want to provide feedback now
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={staffCloseCase}
            >
              <Text style={styles.buttonText}>End My Visit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Clinic Info */}
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicLabel}>Connected to</Text>
          <Text style={styles.clinicName}>{CLINIC.name}</Text>
          <Text style={styles.clinicDetails}>
            Automatic check-in enabled • Location services active
          </Text>
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        visitId={feedbackVisitId}
        onClose={() => {
          setFeedbackModalVisible(false);
          setFeedbackVisitId(null);
        }}
        onSubmit={() => {
          showAlert("Thank you!", "Your feedback has been submitted.");
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmationVisible}
        title="Close Visit"
        message="Are you sure you want to close this visit?"
        confirmText="Close"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={handleConfirmCloseVisit}
        onCancel={() => setConfirmationVisible(false)}
      />

      {/* Alert Modal */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  titleGradient: {
    color: "#3b9eff",
  },
  subtitle: {
    fontSize: 16,
    color: "#93c5fd",
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dbeafe",
  },
  statusBadgeActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34d399",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: "#34d399",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  statusBadgeInactive: {
    backgroundColor: "rgba(71, 85, 105, 0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1fae5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  visitInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a3550",
  },
  visitInfoText: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },
  visitId: {
    fontSize: 12,
    color: "#93c5fd",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#93c5fd",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 14,
    padding: 16,
    color: "white",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "rgba(96, 165, 250, 0.4)",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#3b9eff",
    borderWidth: 1.5,
    borderColor: "#60a5fa",
  },
  secondaryButton: {
    backgroundColor: "rgba(59, 158, 255, 0.15)",
    borderWidth: 2,
    borderColor: "#3b9eff",
  },
  dangerButton: {
    backgroundColor: "#f87171",
    borderWidth: 1.5,
    borderColor: "#fca5a5",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#60a5fa",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  clinicInfo: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#3b9eff",
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  clinicLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#93c5fd",
    marginBottom: 4,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  clinicDetails: {
    fontSize: 13,
    color: "#93c5fd",
  },
});
