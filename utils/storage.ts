// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Visit {
  id: string;
  timestamp: number;
  mood?: string;
  comment?: string;
  enteredAt?: number;
  exitedAt?: number;
  feedback?: Feedback;
  status: "active" | "completed";
}

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: number;
}

const VISITS_KEY = "welcomevision_visits";
const ACTIVE_VISIT_KEY = "welcomevision_active_visit";

export const StorageService = {
  // Active visit management
  async getActiveVisit(): Promise<Visit | null> {
    const data = await AsyncStorage.getItem(ACTIVE_VISIT_KEY);
    return data ? JSON.parse(data) : null;
  },

  async setActiveVisit(visit: Visit): Promise<void> {
    await AsyncStorage.setItem(ACTIVE_VISIT_KEY, JSON.stringify(visit));
  },

  async clearActiveVisit(): Promise<void> {
    await AsyncStorage.removeItem(ACTIVE_VISIT_KEY);
  },

  // Visit history management
  async getVisits(): Promise<Visit[]> {
    const data = await AsyncStorage.getItem(VISITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addVisit(visit: Visit): Promise<void> {
    const visits = await this.getVisits();
    visits.unshift(visit); // Add to beginning
    await AsyncStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  },

  async updateVisit(visitId: string, updates: Partial<Visit>): Promise<void> {
    const visits = await this.getVisits();
    const index = visits.findIndex((v) => v.id === visitId);
    if (index !== -1) {
      visits[index] = { ...visits[index], ...updates };
      await AsyncStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    }
  },

  async addFeedbackToVisit(visitId: string, feedback: Feedback): Promise<void> {
    await this.updateVisit(visitId, { feedback, status: "completed" });
  },

  // Helper to create a new visit
  createVisit(mood?: string, comment?: string): Visit {
    return {
      id: `visit_${Date.now()}`,
      timestamp: Date.now(),
      mood,
      comment,
      enteredAt: Date.now(),
      status: "active",
    };
  },
};
