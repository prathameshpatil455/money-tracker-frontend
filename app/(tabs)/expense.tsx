import Button from "@/components/Button";
import CategorySelection from "@/components/CategorySelection";
import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { useTheme } from "@/context/ThemeContext";
import { expenseCategoriesWithIcons } from "@/data/categories";
import { useTransactionStore } from "@/store/transaction";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { Bookmark, Calendar, IndianRupee, Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface GroupedTransactions {
  [key: string]: any[];
}

const ExpenseScreen = () => {
  const { colors } = useTheme();
  const { transactions, loading, fetchTransactions, createTransaction } =
    useTransactionStore();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    expenseCategoriesWithIcons[0].value
  );
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Group transactions by month
  const groupedTransactions = transactions
    .filter((t) => t.type === "expense")
    .reduce((groups: GroupedTransactions, transaction) => {
      const monthYear = format(parseISO(transaction.date), "MMMM yyyy");
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(transaction);
      return groups;
    }, {});

  // Sort months in descending order (most recent first)
  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) => {
    return (
      parseISO(groupedTransactions[b][0].date).getTime() -
      parseISO(groupedTransactions[a][0].date).getTime()
    );
  });

  const handleAmountChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, "");
    if (filtered.split(".").length <= 2) setAmount(filtered);
  };

  const handleAddExpense = async () => {
    if (!amount || parseFloat(amount) === 0) return;

    const success = await createTransaction({
      amount: parseFloat(amount),
      type: "expense",
      category: selectedCategory,
      description: note,
      date: date.toISOString(),
    });

    if (success) {
      // Reset
      setAmount("");
      setNote("");
      setSelectedCategory(expenseCategoriesWithIcons[0].value);
      setDate(new Date());
      setShowModal(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Expenses" />

      {/* 🧾 Recent Transactions */}
      <View
        style={[
          styles.recentTransactionsSection,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recent Expenses
        </Text>
        {loading ? (
          <Text
            style={[styles.noTransactionsText, { color: colors.textSecondary }]}
          >
            Loading transactions...
          </Text>
        ) : sortedMonths.length > 0 ? (
          <ScrollView
            style={styles.transactionsList}
            showsVerticalScrollIndicator={false}
          >
            {sortedMonths.map((monthYear, monthIndex) => (
              <View key={monthYear}>
                <Text
                  style={[styles.monthHeader, { color: colors.textSecondary }]}
                >
                  {monthYear}
                </Text>
                {groupedTransactions[monthYear].map((transaction, index) => (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                    isLast={index === groupedTransactions[monthYear].length - 1}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text
            style={[styles.noTransactionsText, { color: colors.textSecondary }]}
          >
            No expense transactions yet
          </Text>
        )}
      </View>

      {/* ➕ Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowModal(true)}
      >
        <Plus size={28} color={colors.white} />
      </TouchableOpacity>

      {/* ⬇️ Bottom Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Add Expense
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Amount Input */}
              <View style={styles.inputSection}>
                <Text
                  style={[styles.inputLabel, { color: colors.textPrimary }]}
                >
                  Amount
                </Text>
                <View
                  style={[
                    styles.amountInputContainer,
                    { backgroundColor: colors.inputBackground },
                  ]}
                >
                  <IndianRupee size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.amountInput, { color: colors.textPrimary }]}
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.placeholderText}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.inputSection}>
                <Text
                  style={[styles.inputLabel, { color: colors.textPrimary }]}
                >
                  Category
                </Text>
                <CategorySelection
                  categories={expenseCategoriesWithIcons}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </View>

              {/* Date Selection */}
              <View style={styles.inputSection}>
                <Text
                  style={[styles.inputLabel, { color: colors.textPrimary }]}
                >
                  Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateSelector,
                    { backgroundColor: colors.inputBackground },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color={colors.textSecondary} />
                  <Text
                    style={[styles.dateText, { color: colors.textPrimary }]}
                  >
                    {format(date, "MMMM d, yyyy")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Note Input */}
              <View style={styles.inputSection}>
                <Text
                  style={[styles.inputLabel, { color: colors.textPrimary }]}
                >
                  Note
                </Text>
                <View
                  style={[
                    styles.noteInputContainer,
                    { backgroundColor: colors.inputBackground },
                  ]}
                >
                  <Bookmark
                    size={20}
                    color={colors.textSecondary}
                    style={{ marginTop: 10 }}
                  />
                  <TextInput
                    style={[styles.noteInput, { color: colors.textPrimary }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Add a note"
                    placeholderTextColor={colors.placeholderText}
                    multiline
                  />
                </View>
              </View>

              <Button
                title="Add Expense"
                onPress={handleAddExpense}
                style={styles.addButton}
              />
            </ScrollView>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 120,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 16,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
  },
  noteInputContainer: {
    flexDirection: "row",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  recentTransactionsSection: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionsList: {
    flex: 1,
  },
  monthHeader: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  addButton: {
    marginTop: 24,
  },
});

export default ExpenseScreen;
