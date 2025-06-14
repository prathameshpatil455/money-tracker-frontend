import Button from "@/components/Button";
import CategorySelection from "@/components/CategorySelection";
import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
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
    <View style={styles.container}>
      <Header title="Expenses" />

      {/* 🧾 Recent Transactions */}
      <View style={styles.recentTransactionsSection}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {loading ? (
          <Text style={styles.noTransactionsText}>Loading transactions...</Text>
        ) : sortedMonths.length > 0 ? (
          <ScrollView
            style={styles.transactionsList}
            showsVerticalScrollIndicator={false}
          >
            {sortedMonths.map((monthYear, monthIndex) => (
              <View key={monthYear}>
                <Text style={styles.monthHeader}>{monthYear}</Text>
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
          <Text style={styles.noTransactionsText}>
            No expense transactions yet
          </Text>
        )}
      </View>

      {/* ➕ Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Plus size={28} color={COLORS.white} />
      </TouchableOpacity>

      {/* ⬇️ Bottom Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={COLORS.grayDark} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Amount Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.amountInputContainer}>
                  <IndianRupee size={20} color={COLORS.grayDark} />
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={handleAmountChange}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={COLORS.grayMedium}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Category</Text>
                <CategorySelection
                  categories={expenseCategoriesWithIcons}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </View>

              {/* Date Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.dateSelector}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color={COLORS.grayDark} />
                  <Text style={styles.dateText}>
                    {format(date, "MMMM d, yyyy")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Note Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Note</Text>
                <View style={styles.noteInputContainer}>
                  <Bookmark
                    size={20}
                    color={COLORS.grayDark}
                    style={{ marginTop: 10 }}
                  />
                  <TextInput
                    style={styles.noteInput}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Add a note"
                    placeholderTextColor={COLORS.grayMedium}
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
    backgroundColor: COLORS.background,
    paddingBottom: 120,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: SIZES.radius,
    marginHorizontal: 4,
  },
  inputLabel: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: "bold",
    color: COLORS.black,
  },
  closeButton: {
    padding: 8,
  },
  currencySymbol: {
    ...FONTS.h2,
    color: COLORS.black,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    ...FONTS.h2,
    color: COLORS.black,
    height: "100%",
    marginTop: 6,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginLeft: 8,
  },
  noteInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minHeight: 140,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.black,
    marginLeft: 8,
    textAlignVertical: "top",
  },
  addButton: {
    marginVertical: SIZES.padding,
  },
  recentTransactionsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 80,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 16,
  },
  transactionsList: {
    maxHeight: 500,
    paddingBottom: 120,
  },
  noTransactionsText: {
    ...FONTS.body3,
    color: COLORS.grayMedium,
    textAlign: "center",
    marginVertical: SIZES.padding,
  },
  fab: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 50,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  monthHeader: {
    ...FONTS.h4,
    color: COLORS.grayDark,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});

export default ExpenseScreen;
