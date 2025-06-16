import * as Notifications from "expo-notifications";

// Optional: Configure how the notification behaves
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

type NotificationPayload = {
  title: string;
  body: string;
  data?: any;
  triggerInSeconds?: number; // default is immediate
};

export async function scheduleLocalNotification({
  title,
  body,
  data = {},
  triggerInSeconds = 1,
}: NotificationPayload) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: {
      type: "seconds",
      seconds: triggerInSeconds,
      repeats: false,
    },
  });
}
