import { useTheme } from "@/context/ThemeContext";
import { Bell, Search } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Search size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Bell size={24} color={colors.textPrimary} />
          <View
            style={[
              styles.notificationBadge,
              {
                backgroundColor: colors.error,
                borderColor: colors.cardBackground,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
});

export default Header;
