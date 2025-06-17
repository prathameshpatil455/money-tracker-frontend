import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { useThemeColor } from "../hooks/useThemeColor";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const { requestNotificationPermissions } = useNotifications();
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const [fontsLoaded, fontError] = useFonts({
    // "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    // "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    // "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermissions();
    }
  }, [isAuthenticated]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor }} onLayout={onLayoutRootView}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor,
            },
            headerTintColor: textColor,
            headerTitleStyle: {
              fontFamily: "SpaceMono-Regular",
            },
            contentStyle: {
              backgroundColor,
            },
            headerShown: false,
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
