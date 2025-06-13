import Button from "@/components/Button";
import CategorySelection from "@/components/CategorySelection";
import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
import { incomeCategoriesWithIcons } from "@/data/categories";
import { mockTransactions } from "@/data/mockData";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Bookmark, Calendar, IndianRupee } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const IncomeScreen = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    incomeCategoriesWithIcons[0].value
  );
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter only income transactions
  const incomeTransactions = mockTransactions
    .filter((t) => t.type === "income")
    .slice(0, 5);

  const handleAmountChange = (text) => {
    // Only allow numbers and a single decimal point
    const filteredText = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = filteredText.split(".");
    if (parts.length > 2) {
      return;
    }

    setAmount(filteredText);
  };

  const handleAddIncome = () => {
    if (!amount || parseFloat(amount) === 0) {
      // You would add proper validation here
      return;
    }

    // You would add this income to your state/database here
    console.log({
      amount: parseFloat(amount),
      category: selectedCategory,
      date,
      note,
      type: "income",
    });

    // Reset form
    setAmount("");
    setNote("");
    setSelectedCategory(incomeCategoriesWithIcons[0].value);
    setDate(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 35} // Adjust based on header/nav height
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Header title="Add Income" />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Amount Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.amountInputContainer}>
                  <IndianRupee size={20} color={COLORS.grayDark} />
                  {/* <Text style={styles.currencySymbol}>h</Text> */}
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
                  categories={incomeCategoriesWithIcons}
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
                    style={{ marginTop: 8 }}
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

              {/* Add Button */}
              <Button
                title="Add Income"
                onPress={handleAddIncome}
                style={styles.addButton}
              />

              {/* Recent Income Transactions */}
              <View style={styles.recentTransactionsSection}>
                <Text style={styles.sectionTitle}>Recent Income</Text>
                {incomeTransactions.length > 0 ? (
                  <View style={styles.transactionsList}>
                    {incomeTransactions.map((transaction, index) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        isLast={index === incomeTransactions.length - 1}
                      />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noTransactionsText}>
                    No income transactions yet
                  </Text>
                )}
              </View>
            </ScrollView>

            {/* Date Picker Modal */}
            {/* {showDatePicker && (
          <Animated.View
            style={styles.datePickerContainer}
            entering={FadeInUp}
            exiting={FadeOutDown}
          >
            <DatePicker
              date={date}
              onChange={setDate}
              onClose={() => setShowDatePicker(false)}
            />
          </Animated.View>
        )} */}
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
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 80,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 3,
  },
  inputSection: {
    marginBottom: SIZES.radius,
  },
  inputLabel: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: 4,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 60,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 50,
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
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 16,
  },
  transactionsList: {
    marginTop: 8,
  },
  noTransactionsText: {
    ...FONTS.body3,
    color: COLORS.grayMedium,
    textAlign: "center",
    marginVertical: SIZES.padding,
  },
  datePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    padding: SIZES.padding,
  },
});

export default IncomeScreen;
