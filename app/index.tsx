import * as React from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { View, Platform, StyleSheet, Pressable, Image } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MenuIcon from '../assets/images/menu.svg'
import FocusedMenuIcon from '../assets/images/menu-focused.svg'

import ProfileIcon from '../assets/images/profile.svg'
import FocusedProfileIcon from '../assets/images/profile-focused.svg'
import Menu from './components/Menu';
import Register from './components/Register';
import Profile from './components/Profile';


function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.button}
            key={index}
          >
            {label === 'Register' && <Text style={isFocused ? styles.activeTitle : styles.title}>
              {label}
            </Text>}
            {
              label === 'Menu' && 
              (!isFocused ? <MenuIcon width='24' height='24' style={{ transform: [{ scaleX: -1 }] }} /> : <FocusedMenuIcon width='24' height='24' />)
              
            }

            {
              label === 'Profile' && 
              (!isFocused ? <ProfileIcon width='24' height='24' /> : <FocusedProfileIcon width='24' height='24' style={{ transform: [{ scaleX: -1 }] }} />)

            }
          </PlatformPressable>
        );
      })}
    </View>
  );
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        header: () => null
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Menu" component={Menu} />
      <Tab.Screen name="Register" component={Register} />
      <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    height: 75,
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6, // Android shadow
    textAlign: 'center'
  },
  button: {
    flex: 1,
    justifyContent: "flex-start", // centers vertically
    alignItems: "center",
    backgroundColor: "#fff",
    textAlign: 'center'
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#215D98",
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: 'center'
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain', // keeps aspect ratio
  },
});