import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ColorSchemeName } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import AuthScreen from '../screens/AuthScreen';
import ChooseUsernameScreen from '../screens/ChooseUsernameScreen';
import GlobalContext from '../utils/context';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({ colorScheme }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <AuthRootNavigation />
        </NavigationContainer>
    );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

const AuthRootNavigation = withOAuth(RootNavigator);

function RootNavigator({ oAuthUser }) {
    const isLoggedIn = !!oAuthUser;
    const { skipChooseUsername } = useContext(GlobalContext);
    const shouldChooseUsername =
        !skipChooseUsername &&
        !oAuthUser?.attributes['custom:display_username']?.length;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn && !shouldChooseUsername ? (
                <Stack.Screen name="Root" component={BottomTabNavigator} />
            ) : isLoggedIn && shouldChooseUsername ? (
                <Stack.Screen
                    name="ChooseUsername"
                    component={ChooseUsernameScreen}
                />
            ) : (
                <Stack.Screen name="Login" component={AuthScreen} />
            )}
            <Stack.Screen
                name="NotFound"
                component={NotFoundScreen}
                options={{ title: 'Oops!' }}
            />
        </Stack.Navigator>
    );
}

export default Navigation;
