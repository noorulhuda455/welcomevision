// app/(tabs)/history.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { StorageService, type Visit } from "../../utils/storage";

export default function HistoryScreen() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadVisits = async () => {
    try {
      const data = await StorageService.getVisits();
      setVisits(data);
    } catch (error) {
      console.error("Error loading visits:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisits();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadVisits();
    }, [])
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDuration = (enteredAt?: number, exitedAt?: number) => {
    if (!enteredAt || !exitedAt) return null;
    const minutes = Math.round((exitedAt - enteredAt) / 1000 / 60);
    return `${minutes} min`;
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[styles.star, star <= rating && styles.starFilled]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  const stats = {
    totalVisits: visits.length,
    averageRating:
      visits.filter((v) => v.feedback).length > 0
        ? (
            visits.reduce((sum, v) => sum + (v.feedback?.rating || 0), 0) /
            visits.filter((v) => v.feedback).length
          ).toFixed(1)
        : "N/A",
    completedVisits: visits.filter((v) => v.status === "completed").length,
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#1e40af"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Text style={styles.header}>
              <Text style={styles.headerGradient}>Visit</Text> History 📊
            </Text>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalVisits}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedVisits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Visit List */}
        {visits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No visits yet</Text>
            <Text style={styles.emptySubtext}>
              Your visit history will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.visitsList}>
            {visits.map((visit) => (
              <View key={visit.id} style={styles.visitCard}>
                <View style={styles.visitHeader}>
                  <View style={styles.visitDate}>
                    <Text style={styles.visitDateText}>
                      {formatDate(visit.timestamp)}
                    </Text>
                    <Text style={styles.visitTime}>
                      {formatTime(visit.timestamp)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      visit.status === "completed" && styles.statusCompleted,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {visit.status === "completed" ? "Completed" : "Active"}
                    </Text>
                  </View>
                </View>

                {visit.mood && (
                  <View style={styles.moodSection}>
                    <Text style={styles.sectionLabel}>Pre-visit mood:</Text>
                    <Text style={styles.moodText}>{visit.mood}</Text>
                  </View>
                )}

                {visit.comment && (
                  <Text style={styles.commentText}>{visit.comment}</Text>
                )}

                {visit.exitedAt && visit.enteredAt && (
                  <View style={styles.durationSection}>
                    <Text style={styles.durationText}>
                      Duration: {calculateDuration(visit.enteredAt, visit.exitedAt)}
                    </Text>
                  </View>
                )}

                {visit.feedback && (
                  <View style={styles.feedbackSection}>
                    <Text style={styles.sectionLabel}>Feedback:</Text>
                    {renderStars(visit.feedback.rating)}
                    {visit.feedback.comment && (
                      <Text style={styles.feedbackComment}>
                        {visit.feedback.comment}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  </LinearGradient>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a8a",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#60a5fa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3b9eff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#dbeafe",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#93c5fd",
  },
  visitsList: {
    gap: 16,
  },
  visitCard: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "rgba(96, 165, 250, 0.25)",
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  visitDate: {
    flex: 1,
  },
  visitDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  visitTime: {
    fontSize: 14,
    color: "#93c5fd",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "rgba(71, 85, 105, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#34d399",
    shadowColor: "#34d399",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  moodSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#93c5fd",
    marginBottom: 4,
    fontWeight: "600",
  },
  moodText: {
    fontSize: 15,
    color: "white",
  },
  commentText: {
    fontSize: 14,
    color: "#bfdbfe",
    fontStyle: "italic",
    marginBottom: 8,
  },
  durationSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(96, 165, 250, 0.2)",
  },
  durationText: {
    fontSize: 13,
    color: "#93c5fd",
  },
  feedbackSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(96, 165, 250, 0.2)",
  },
  stars: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 4,
  },
  star: {
    fontSize: 16,
    color: "rgba(71, 85, 105, 0.5)",
  },
  starFilled: {
    color: "#fde047",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#bfdbfe",
    marginTop: 8,
    fontStyle: "italic",
  },
});
