import {View, Text, SafeAreaView, StyleSheet} from 'react-native'
import RegistrationTopBar from './components/RegistrationTopBar';
import MenuComponent from './components/MenuComponent';
import { useEffect, useState } from 'react';

export default function Register()
{
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [date, setDate] = useState<Date>(new Date());

    const [currentRegistration, setCurrentRegistration] = useState<Object>({});

    // useEffect(() => console.log(currentRegistration), [currentRegistration]);

    useEffect(() => {
        if (selectedDate !== null) {
            const [year, month, day] = selectedDate.split('-').map(Number);
            setDate(new Date(year, month-1, day))
        }
    }, [selectedDate])

    useEffect(() => {
      console.log('registration changed!!')
      console.log(currentRegistration);
    })

    return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <RegistrationTopBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} currentRegistration={currentRegistration} setCurrentRegistration={setCurrentRegistration}/>

      {/* Main Content Area */}
      {selectedDate !== null && <MenuComponent date={date} currentRegistration={currentRegistration} setCurrentRegistration={setCurrentRegistration} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bottomBar: {
    height: 60,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
});