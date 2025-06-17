import { COLORS } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { Animated, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIcon = () => {
    scaleAnim.setValue(0.9);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />
        <Tabs
          screenOptions={({ route }) => ({
            tabBarShowLabel: true,
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textPrimary,
            tabBarIcon: ({ color, size, focused }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";

              switch (route.name) {
                case "index":
                  iconName = "grid";
                  break;
                case "income":
                  iconName = "trending-up";
                  break;
                case "expense":
                  iconName = "trending-down";
                  break;
                case "profile":
                  iconName = "person";
                  break;
              }

              if (focused) animateIcon();

              return (
                <Animated.View
                  style={{ transform: [{ scale: focused ? scaleAnim : 1 }] }}
                >
                  <Ionicons name={iconName} size={size} color={color} />
                </Animated.View>
              );
            },
          })}
        >
          <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
          <Tabs.Screen name="income" options={{ title: "Income" }} />
          <Tabs.Screen name="expense" options={{ title: "Expense" }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 16,
    left: 16,
    right: 16,
    marginHorizontal: 12,
    borderRadius: 16,
    paddingTop: 4,
    height: 70,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  tabBarLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
});
