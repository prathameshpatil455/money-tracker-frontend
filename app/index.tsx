import { useAuthStore } from "@/store/auth";
import * as Notifications from "expo-notifications";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// This allows the notification to show even when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export default function Index() {
  const { checkToken, user, token, error, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    // Start the animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Set timer for navigation
    const timer = setTimeout(() => {
      const isAuthScreen = segments[0] === "(auth)";
      const isSignedIn = user && token;

      console.log(isSignedIn, "isSignedIn");
      console.log(user, token, "user, token");

      if (!isSignedIn && !isAuthScreen) {
        router.replace("/(auth)");
      } else if (isSignedIn && isAuthScreen) {
        router.replace("/(tabs)");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [user, token, segments, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/splash-screen.jpg")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  splashImage: {
    width: "120%",
    height: "120%",
    backgroundColor: "#000",
  },
});
