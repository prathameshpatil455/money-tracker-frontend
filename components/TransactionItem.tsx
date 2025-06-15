import { useTheme } from "@/context/ThemeContext";
import { Transaction } from "@/types";
import { getTransactionIconName } from "@/utils/transactionIcons";
import { format } from "date-fns";
import { IndianRupee } from "lucide-react-native";
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
  const { colors } = useTheme();
  const { category, amount, date, type, title } = transaction;

  // Get the icon for this transaction category
  const iconName = getTransactionIconName(category, type);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !isLast && [styles.borderBottom, { borderBottomColor: colors.border }],
      ]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              type === "income" ? colors.primaryLight : colors.errorLight,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={type === "income" ? colors.black : colors.black}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title || category}
        </Text>
        <Text style={[styles.date, { color: colors.textPrimary }]}>
          {format(new Date(date), "MMM d, yyyy")}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: type === "income" ? colors.primary : colors.error },
        ]}
      >
        {type === "income" ? "+" : "-"}{" "}
        <IndianRupee
          size={12}
          color={type === "income" ? colors.primary : colors.error}
        />
        {amount.toFixed(2)}
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
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
});

export default TransactionItem;
