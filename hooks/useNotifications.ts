import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export const useNotifications = () => {
  const requestNotificationPermissions = async () => {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
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
      console.log("Failed to get push token for push notification!");
      return;
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    requestNotificationPermissions,
  };
};
