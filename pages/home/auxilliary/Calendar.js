import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

export const CalendarModal = () => {
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedCalendarModalDate, setSelectedCalendarModalDate] = useState('');

  const onDateSelect = (day) => {
    setSelectedCalendarModalDate(day.dateString);
    console.log(day.dateString);
  };

  useEffect(() => {
    console.log("CalendarModal")
  }, [])

  return (
    <>
      {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Select Date</Text>
      </TouchableOpacity> */}
      <Modal visible={calendarModalVisible}>
        <View>
          <Calendar
            onDayPress={(day) => onDateSelect(day)}
            markedDates={{ [selectedCalendarModalDate]: { selected: true } }}
            theme={{
              textMonthFontSize: 20,
              monthTextColor: 'black',
              arrowColor: 'black',
            }}
            style={{ height: 350 }}
          />
          <TouchableOpacity onPress={() => setCalendarModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};
