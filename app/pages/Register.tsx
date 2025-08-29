import {View, Text, SafeAreaView, StyleSheet} from 'react-native'
import RegistrationTopBar from './components/RegistrationTopBar';

export default function Register()
{
    return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <RegistrationTopBar />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Placeholder for future menu/details */}
      </View>

      {/* Bottom Menu Placeholder */}
      <View style={styles.bottomBar} />
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