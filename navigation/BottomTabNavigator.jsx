import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ExploreScreen from '../screens/ExploreScreen';
import AppetiteScreen from '../screens/AppetiteScreen';
import SearchScreen from '../screens/SearchScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppetiteIcon from '../components/AppetiteIcon';
import SettingsScreen from '../screens/SettingsScreen';
import FriendProfileScreen from '../screens/FriendProfileScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Explore"
            tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
        >
            <BottomTab.Screen
                name="Explore"
                component={TabOneNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="md-compass" color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Appetite"
                component={TabTwoNavigator}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <AppetiteIcon focused={focused} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Search"
                component={TabThreeNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="md-search" color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Friends"
                component={TabFourNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="md-people" color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={TabFiveNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="ios-person" color={color} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator();

function TabOneNavigator() {
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen
                name="ExploreScreen"
                component={ExploreScreen}
                options={{
                    headerShown: false,
                }}
            />
        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator();
function TabTwoNavigator() {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen
                name="AppetiteScreen"
                component={AppetiteScreen}
                options={{ headerTitle: 'Appetite' }}
            />
        </TabTwoStack.Navigator>
    );
}

const TabThreeStack = createStackNavigator();
function TabThreeNavigator() {
    return (
        <TabThreeStack.Navigator>
            <TabThreeStack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{ headerTitle: 'Search' }}
            />
        </TabThreeStack.Navigator>
    );
}

const TabFourStack = createStackNavigator();
function TabFourNavigator() {
    return (
        <TabFourStack.Navigator>
            <TabFourStack.Screen
                name="FriendsScreen"
                component={FriendsScreen}
                options={{ headerTitle: 'Friends' }}
            />
            <TabFourStack.Screen
                name="FriendProfile"
                component={FriendProfileScreen}
            />
        </TabFourStack.Navigator>
    );
}

const TabFiveStack = createStackNavigator();
function TabFiveNavigator() {
    return (
        <TabFiveStack.Navigator>
            <TabFiveStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerTitle: 'Profile' }}
                initialParams={{
                    displayUsername: '-1',
                }}
            />
            <TabFiveStack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ headerTitle: 'Settings' }}
            />
        </TabFiveStack.Navigator>
    );
}
