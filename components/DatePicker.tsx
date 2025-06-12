import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';

interface DatePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker = ({ date, onChange, onClose }: DatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(date));
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handleDayPress = (day: Date) => {
    onChange(day);
  };
  
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth}>
          <ChevronLeft size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{format(currentMonth, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <ChevronRight size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderDays = () => {
    return (
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
    );
  };
  
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
          const isCurrentDay = isSameDay(day, date);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);
          
          return (
            <TouchableOpacity
              key={day.toString()}
              style={[
                styles.dateButton,
                isCurrentDay && styles.selectedDate,
                isDayToday && styles.todayDate
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text
                style={[
                  styles.dateText,
                  !isCurrentMonth && styles.outsideMonthDate,
                  isCurrentDay && styles.selectedDateText,
                  isDayToday && styles.todayDateText
                ]}
              >
                {format(day, 'd')}
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
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayLabel: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    width: 36,
    textAlign: 'center',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dateButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 18,
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
    fontFamily: 'Inter-Medium',
  },
  todayDate: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  todayDateText: {
    color: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Inter-Medium',
  },
  confirmButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontFamily: 'Inter-Medium',
  },
});

export default DatePicker;