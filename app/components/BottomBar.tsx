import * as React from 'react';
import {
    createStaticNavigation,
    NavigationContainer,
    NavigationIndependentTree,
    useLinkBuilder,
    useTheme,
    NavigationState,
    ParamListBase,
    NavigationProp,
} from '@react-navigation/native';
import { View, Platform, StyleSheet, Pressable } from 'react-native';
import { Text } from '@react-navigation/elements';
const PlatformPressable = Pressable as any;

import MenuIcon from '../../assets/images/menu.svg';
import FocusedMenuIcon from '../../assets/images/menu-focused.svg';
import ProfileIcon from '../../assets/images/profile.svg';
import FocusedProfileIcon from '../../assets/images/profile-focused.svg';
import Menu from './Menu';
import Register from './Register';
import Profile from './Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type BottomBarProps = {
    state: NavigationState<ParamListBase>;
    descriptors: Record<
    string,
    {
        options: any;
        navigation: NavigationProp<ParamListBase>;
    }
    >;
    navigation: NavigationProp<ParamListBase>;
};

function BottomBar({ state, descriptors, navigation }: BottomBarProps) {
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
            // @ts-ignore
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.button}
            key={index}
            >
            {label === 'Register' && (
                <Text style={isFocused ? styles.activeTitle : styles.title}>
                {label}
                </Text>
            )}
            {label === 'Menu' &&
                (!isFocused ? (
                <MenuIcon width="24" height="24" style={{ transform: [{ scaleX: -1 }] }} />
                ) : (
                <FocusedMenuIcon width="24" height="24" />
                ))}
            {label === 'Profile' &&
                (!isFocused ? (
                <ProfileIcon width="24" height="24" />
                ) : (
                <FocusedProfileIcon width="24" height="24" style={{ transform: [{ scaleX: -1 }] }} />
                ))}
            </PlatformPressable>
        );
        })}
    </View>
    );
}

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
    <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        header: () => null,
        }}
        tabBar={(props) => <BottomBar {...props} />}
    >
        <Tab.Screen name="Menu" component={Menu} />
        <Tab.Screen name="Register" component={Register} />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        height: 75,
        backgroundColor: 'white',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        textAlign: 'center',
    },
    button: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    activeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#215D98',
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});