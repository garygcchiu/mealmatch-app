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

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <GlobalProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </GlobalProvider>
        </SafeAreaProvider>
    );
}
