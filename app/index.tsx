import * as React from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

import Tabs from "./pages/BottomBar"
import LoginModal from './pages/components/LoginModal';

export default function App() {
  const [login, setLoggedIn] = React.useState(false)

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tabs />
        <LoginModal modalVisible={login} setModalVisible={setLoggedIn} />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}