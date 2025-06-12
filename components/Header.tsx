import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import { Bell, Search } from 'lucide-react-native';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={24} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={COLORS.black} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.expense,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});

export default Header;