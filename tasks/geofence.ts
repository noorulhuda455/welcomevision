// tasks/geofence.ts
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { StorageService } from "../utils/storage";

export const GEOFENCE_TASK = "welcomevision-geofence-task";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Define the geofence task
TaskManager.defineTask(
  GEOFENCE_TASK,
  async ({ data: { eventType, region }, error }: any) => {
    if (error) {
      console.error("Geofence task error:", error);
      return;
    }

    try {
      if (eventType === 1) {
        // ENTER
        console.log("Patient entered clinic:", region.identifier);

        // Send notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Welcome to the Clinic!",
            body: "We're glad you're here. Please check in at the front desk.",
            data: { type: "clinic_entry" },
          },
          trigger: null, // Send immediately
        });

        // Create active visit
        const visit = StorageService.createVisit();
        await StorageService.setActiveVisit(visit);
      } else if (eventType === 2) {
        // EXIT
        console.log("Patient left clinic:", region.identifier);

        // Get active visit
        const activeVisit = await StorageService.getActiveVisit();

        if (activeVisit) {
          // Update visit with exit time
          const updatedVisit = {
            ...activeVisit,
            exitedAt: Date.now(),
          };

          // Save to history
          await StorageService.addVisit(updatedVisit);
          await StorageService.clearActiveVisit();

          // Send feedback request notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "How was your visit?",
              body: "We'd love to hear your feedback!",
              data: { type: "feedback_request", visitId: activeVisit.id },
            },
            trigger: { seconds: 5 } as any, // Small delay
          });
        }
      }
    } catch (error) {
      console.error("Error in geofence task:", error);
    }
  }
);
