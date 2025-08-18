import * as React from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

import Tabs from "./pages/BottomBar"

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}