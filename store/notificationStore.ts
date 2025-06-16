import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { create } from "zustand";

type NotificationStore = {
  expoPushToken: string | null;
  registerForPushNotifications: () => Promise<void>;
  sendPushNotification: (
    title: string,
    body: string,
    data?: Record<string, any>
  ) => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  expoPushToken: null,

  // Step 1: Register for notifications
  registerForPushNotifications: async () => {
    try {
      if (!Device.isDevice) {
        alert("Must use a physical device for push notifications");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("✅ Expo Push Token:", token);
      set({ expoPushToken: token });
    } catch (err) {
      console.error("Error registering for push notifications:", err);
    }
  },

  // Step 2: Send push notification
  sendPushNotification: async (title, body, data = {}) => {
    const token = get().expoPushToken;
    if (!token) {
      console.warn("⚠️ No Expo Push Token found. Cannot send notification.");
      return;
    }

    try {
      const message = {
        to: token,
        sound: "default",
        title,
        body,
        data,
      };

      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        message,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📩 Push sent:", response.data);
    } catch (err) {
      console.error("❌ Push error:", err.response?.data || err.message);
    }
  },
}));
