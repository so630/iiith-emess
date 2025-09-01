import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import RegistrationTopBar from "./components/RegistrationTopBar";
import MenuComponent from "./components/MenuComponent";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { _getAuthKey, transformData, DayMeals } from "@/app/helpers";

export default function Register() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [currentRegistration, setCurrentRegistration] = useState<Object>({});
  const [weekData, setWeekData] = useState<DayMeals[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  // start/end dates for the week
  const [startDate, setStartDate] = useState(
    dayjs().startOf("week").startOf("day").toDate()
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("week").endOf("day").toDate()
  );

  // fetch registrations at this level
  useEffect(() => {
    const fetchRegistrationData = async () => {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const authKey = await _getAuthKey();
      const response = await fetch(
        `https://mess.iiit.ac.in/api/registrations?from=${start}&to=${end}`,
        { headers: { Authorization: authKey } }
      );
      const data = await response.json();
      const transformed = transformData(data, startDate, endDate);
      setWeekData(transformed);
    };

    fetchRegistrationData();
  }, [startDate, endDate]);

  // keep selectedDate → Date object synced
  useEffect(() => {
    if (selectedDate !== null) {
      const [year, month, day] = selectedDate.split("-").map(Number);
      setDate(new Date(year, month - 1, day));
    }
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <RegistrationTopBar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentRegistration={currentRegistration}
        setCurrentRegistration={setCurrentRegistration}
        weekData={weekData}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      {/* Main Content Area */}
      {selectedDate !== null && (
        <MenuComponent
          date={date}
          currentRegistration={currentRegistration}
          setCurrentRegistration={setCurrentRegistration}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
