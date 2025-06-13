import { COLORS, FONTS, SIZES } from "@/constants/theme";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DatePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker = ({ date, onChange, onClose }: DatePickerProps) => {
  const selectedDate = dayjs(date);
  const [currentMonth, setCurrentMonth] = useState(dayjs(date));

  const startDate = currentMonth.startOf("month").startOf("week");
  const endDate = currentMonth.endOf("month").endOf("week");

  const monthDays: dayjs.Dayjs[] = [];
  let day = startDate;

  while (day.isSameOrBefore(endDate, "day")) {
    monthDays.push(day);
    day = day.add(1, "day");
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayPress = (day: dayjs.Dayjs) => {
    onChange(day.toDate());
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
      >
        <ChevronLeft size={24} color={COLORS.black} />
      </TouchableOpacity>
      <Text style={styles.monthText}>{currentMonth.format("MMMM YYYY")}</Text>
      <TouchableOpacity
        onPress={() => setCurrentMonth((prev) => prev.add(1, "month"))}
      >
        <ChevronRight size={24} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );

  const renderDays = () => (
    <View style={styles.daysContainer}>
      {days.map((day) => (
        <Text key={day} style={styles.dayLabel}>
          {day}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerHeader}>
        <Text style={styles.pickerTitle}>Select Date</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {renderHeader()}
      {renderDays()}

      <View style={styles.datesContainer}>
        {monthDays.map((day) => {
          const isCurrentDay = day.isSame(selectedDate, "day");
          const isCurrentMonth = day.month() === currentMonth.month();
          const isDayToday = day.isToday();
          const isSelectedAndToday = isCurrentDay && isDayToday;

          return (
            <TouchableOpacity
              key={day.format("YYYY-MM-DD")}
              style={[
                styles.dateButton,
                isCurrentDay && styles.selectedDate,
                isDayToday && styles.todayDate,
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text
                style={[
                  styles.dateText,
                  !isCurrentMonth && styles.outsideMonthDate,
                  isCurrentDay && styles.selectedDateText,
                  isDayToday && !isCurrentDay && styles.todayDateText,
                  isSelectedAndToday && { color: COLORS.white },
                ]}
              >
                {day.format("D")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={onClose}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    zIndex: 50,
    marginBottom: 100,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pickerTitle: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayLabel: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    width: 36,
    textAlign: "center",
  },
  datesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateButton: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 999,
    paddingVertical: 8,
  },
  dateText: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  outsideMonthDate: {
    color: COLORS.gray,
  },
  selectedDate: {
    backgroundColor: COLORS.primary,
  },
  selectedDateText: {
    color: COLORS.white,
    fontFamily: "Inter-Medium",
  },
  todayDate: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  todayDateText: {
    color: COLORS.primary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    ...FONTS.body3,
    color: COLORS.black,
    fontFamily: "Inter-Medium",
  },
  confirmButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontFamily: "Inter-Medium",
  },
});

export default DatePicker;
