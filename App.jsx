import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { GlobalProvider } from './utils/context';

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
        domain: 'auth.mealmatch.io',
    },
    API: {
        endpoints: [
            {
                name: 'mealmatch-dev',
                endpoint: 'https://dev.api.mealmatch.io',
            },
            {
                name: 'mealmatch-staging',
                endpoint: 'https://staging.api.mealmatch.io',
            },
            {
                name: 'mealmatch-prod',
                endpoint: 'https://prod.api.mealmatch.io',
            },
        ],
    },
});

function App() {
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

export default App;
