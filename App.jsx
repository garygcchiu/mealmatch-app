import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { GlobalProvider } from './context/GlobalContext';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { Text, View, Button } from './components/Themed';
import { withOAuth } from 'aws-amplify-react-native';

async function urlOpener(url, redirectUrl) {
    const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
        url,
        redirectUrl
    );

    if (type === 'success' && Platform.OS === 'ios') {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
}

Amplify.configure({
    ...awsconfig,
    oauth: {
        ...awsconfig.oauth,
        urlOpener,
    },
});

function App(props) {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    const {
        oAuthUser,
        oAuthError,
        hostedUISignIn,
        facebookSignIn,
        googleSignIn,
        amazonSignIn,
        customProviderSignIn,
        signOut,
    } = props;

    if (!isLoadingComplete) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <Text>.......</Text>
            <Text>.......</Text>
            <Text>.......</Text>
            <Text>
                User:{' '}
                {oAuthUser ? JSON.stringify(oAuthUser.attributes) : 'None'}
            </Text>
            {oAuthUser ? (
                <Button title="Sign Out" onPress={signOut} />
            ) : (
                <>
                    {/* Go to the Cognito Hosted UI */}
                    <Button title="Cognito" onPress={hostedUISignIn} />

                    {/* Go directly to a configured identity provider */}
                    <Button title="Facebook" onPress={facebookSignIn} />
                    <Button title="Google" onPress={googleSignIn} />
                    <Button title="Amazon" onPress={amazonSignIn} />
                </>
            )}
            {/*<Navigation colorScheme={colorScheme} />*/}
            {/*<StatusBar />*/}
        </SafeAreaProvider>
    );
}

export default withOAuth(App);
