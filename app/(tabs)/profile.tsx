import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import { User, Settings, CircleHelp as HelpCircle, Bell, LogOut, CreditCard, Shield, ChevronRight, Moon } from 'lucide-react-native';

const ProfileScreen = () => {
  const profileSections = [
    {
      title: 'Account',
      items: [
        { 
          id: 'personal', 
          title: 'Personal Information', 
          icon: <User size={20} color={COLORS.grayDark} />,
          action: () => console.log('Personal Information')
        },
        { 
          id: 'payment', 
          title: 'Payment Methods', 
          icon: <CreditCard size={20} color={COLORS.grayDark} />,
          action: () => console.log('Payment Methods')
        },
        { 
          id: 'security', 
          title: 'Security', 
          icon: <Shield size={20} color={COLORS.grayDark} />,
          action: () => console.log('Security')
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          id: 'notifications', 
          title: 'Notifications', 
          icon: <Bell size={20} color={COLORS.grayDark} />,
          action: () => console.log('Notifications')
        },
        { 
          id: 'appearance', 
          title: 'Appearance', 
          icon: <Moon size={20} color={COLORS.grayDark} />,
          action: () => console.log('Appearance')
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          id: 'help', 
          title: 'Help Center', 
          icon: <HelpCircle size={20} color={COLORS.grayDark} />,
          action: () => console.log('Help Center')
        },
        { 
          id: 'settings', 
          title: 'App Settings', 
          icon: <Settings size={20} color={COLORS.grayDark} />,
          action: () => console.log('App Settings')
        },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$2,450</Text>
            <Text style={styles.statLabel}>Income</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$1,870</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$580</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.sectionItem,
                    index === section.items.length - 1 && styles.sectionItemLast
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.sectionItemLeft}>
                    {item.icon}
                    <Text style={styles.sectionItemText}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={COLORS.expense} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
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
    marginLeft: SIZES.padding,
  },
  profileName: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  profileEmail: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
  },
  editButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.gray,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.grayDark,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionItemLast: {
    borderBottomWidth: 0,
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionItemText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.padding * 2,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    ...FONTS.body3,
    color: COLORS.expense,
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  versionText: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    textAlign: 'center',
    marginTop: SIZES.padding,
  },
});

export default ProfileScreen;