// app/index.tsx
import React, { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEOFENCE_TASK = "welcomevision-geofence-task";

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
  const [visitId, setVisitId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      await Location.requestBackgroundPermissionsAsync();
      await Notifications.requestPermissionsAsync();

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
    })();
  }, []);

  const openCase = async () => {
    const id = `visit_${Date.now()}`;
    await AsyncStorage.setItem("visitId", id);
    setVisitId(id);
    Alert.alert("Case opened", "We saved your note.");
  };

  const staffCloseCase = async () => {
    if (!visitId) return;
    await AsyncStorage.removeItem("visitId");
    setVisitId(null);
    Alert.alert("Case closed", "Feedback request sent.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1220" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "700" }}>WelcomeVision</Text>
        <Text style={{ color: "#bcd", marginTop: 4 }}>
          Clinic geofence: {CLINIC.name} ({CLINIC.radius}m)
        </Text>

        <View style={{ marginVertical: 16 }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>How are you feeling today?</Text>
          <TextInput
            value={mood}
            onChangeText={setMood}
            placeholder="e.g., Eyes feel dry"
            placeholderTextColor="#99a"
            style={{ backgroundColor: "#1d2540", color: "white", borderRadius: 12, padding: 12, marginVertical: 8 }}
          />
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Anything else?"
            placeholderTextColor="#99a"
            style={{ backgroundColor: "#1d2540", color: "white", borderRadius: 12, padding: 12, height: 80, textAlignVertical: "top" }}
            multiline
          />
          <Button title={visitId ? "Update note" : "Open case & save note"} onPress={openCase} />
        </View>

        <View style={{ marginVertical: 16 }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>Case status</Text>
          <Text style={{ color: "white", marginBottom: 8 }}>Current visit: {visitId ?? "None"}</Text>
          <Button title="Staff close (desk)" onPress={staffCloseCase} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}