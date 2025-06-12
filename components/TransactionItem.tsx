import { COLORS, FONTS } from "@/constants/theme";
import { Transaction } from "@/types";
import { getTransactionIconName } from "@/utils/transactionIcons";
import { format } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface TransactionItemProps {
  transaction: Transaction;
  isLast?: boolean;
}

const TransactionItem = ({
  transaction,
  isLast = false,
}: TransactionItemProps) => {
  const { category, amount, date, type, title } = transaction;

  // Get the icon for this transaction category
  const iconName = getTransactionIconName(category, type);

  return (
    <TouchableOpacity
      style={[styles.container, !isLast && styles.borderBottom]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              type === "income"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={COLORS.primary}
        />

        {/* <Icon size={20} color={type === 'income' ? COLORS.success : COLORS.expense} /> */}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title || category}</Text>
        <Text style={styles.date}>{format(new Date(date), "MMM d, yyyy")}</Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: type === "income" ? COLORS.success : COLORS.expense },
        ]}
      >
        {type === "income" ? "+" : "-"}${amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  date: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginTop: 2,
  },
  amount: {
    ...FONTS.h4,
    fontFamily: "Inter-Medium",
  },
});

export default TransactionItem;
