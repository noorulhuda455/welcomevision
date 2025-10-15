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
        colors={["#0f172a", "#1e293b", "#0f172a"]}
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
    backgroundColor: "#0b1220",
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
    color: "#60a5fa",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#4c6fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 111, 255, 0.1)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#60a5fa",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
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
    color: "#94a3b8",
  },
  visitsList: {
    gap: 16,
  },
  visitCard: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.1)",
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
    color: "#94a3b8",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "rgba(71, 85, 105, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    color: "#94a3b8",
    marginBottom: 4,
    fontWeight: "600",
  },
  moodText: {
    fontSize: 15,
    color: "white",
  },
  commentText: {
    fontSize: 14,
    color: "#94a3b8",
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
    color: "#94a3b8",
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
    color: "#fbbf24",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
    fontStyle: "italic",
  },
});
