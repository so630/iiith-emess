import * as React from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

import Tabs from "./pages/BottomBar"
import LoginModal from './pages/components/LoginModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [login, setLoggedIn] = React.useState(true);

  React.useEffect(() => {
    const authenticate = async () => {
    const _getAuthKey = async () => {
      try {
        const value = await AsyncStorage.getItem('@AuthKey');
        if (value !== null) {
          // We have data!!
          return value;
        }
      } catch (error) {
        console.log(error)
      }
    }

    const authKey = await _getAuthKey();
    const res = await fetch('https://mess.iiit.ac.in/api/auth/keys/info', {
        headers: { 'Authorization': authKey ?? '' } as HeadersInit
    });

    if (res.status != 200)
    {
        console.log(res.status);
        setLoggedIn(false)
    }
    else
    {
        // console.log(`${authKey} authenticated`);
        setLoggedIn(true);
    }
  }
    authenticate();
  }, [])

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tabs />
        <LoginModal modalVisible={login} setModalVisible={setLoggedIn} />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}