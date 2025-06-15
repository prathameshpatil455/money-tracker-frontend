import Header from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";
import {
  Bell,
  ChevronRight,
  CreditCard,
  CircleHelp as HelpCircle,
  LogOut,
  Moon,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { colors } = useTheme();

  const profileSections = [
    {
      title: "Account",
      items: [
        {
          id: "personal",
          title: "Personal Information",
          icon: <User size={20} color={colors.textSecondary} />,
          action: () => console.log("Personal Information"),
        },
        {
          id: "payment",
          title: "Payment Methods",
          icon: <CreditCard size={20} color={colors.textSecondary} />,
          action: () => console.log("Payment Methods"),
        },
        {
          id: "security",
          title: "Security",
          icon: <Shield size={20} color={colors.textSecondary} />,
          action: () => console.log("Security"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          icon: <Bell size={20} color={colors.textSecondary} />,
          action: () => console.log("Notifications"),
        },
        {
          id: "appearance",
          title: "Appearance",
          icon: <Moon size={20} color={colors.textSecondary} />,
          action: () => console.log("Appearance"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          title: "Help Center",
          icon: <HelpCircle size={20} color={colors.textSecondary} />,
          action: () => console.log("Help Center"),
        },
        {
          id: "settings",
          title: "App Settings",
          icon: <Settings size={20} color={colors.textSecondary} />,
          action: () => console.log("App Settings"),
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Image
            source={{
              uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              John Doe
            </Text>
            <Text
              style={[styles.profileEmail, { color: colors.textSecondary }]}
            >
              john.doe@example.com
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: colors.inputBackground },
            ]}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View
          style={[styles.statsCard, { backgroundColor: colors.cardBackground }]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              $2,450
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Income
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              $1,870
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Expenses
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              $580
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Balance
            </Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {section.title}
            </Text>
            <View
              style={[
                styles.sectionContent,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.sectionItem,
                    index === section.items.length - 1 &&
                      styles.sectionItemLast,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.sectionItemLeft}>
                    {item.icon}
                    <Text
                      style={[
                        styles.sectionItemText,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          App Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  sectionItemLast: {
    borderBottomWidth: 0,
  },
  sectionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});

export default ProfileScreen;
