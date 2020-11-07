import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withOAuth } from 'aws-amplify-react-native';
import Amplify, { Auth, Hub } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import awsconfig from './aws-exports';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {Button, View, Text} from "./components/Themed";
import { Linking, Platform } from "react-native";

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
    customProviderSignIn,
    signOut,
  } = props;

  const [user, setUser] = useState(null);

  function getUser() {
    return Auth.currentAuthenticatedUser()
        .then((userData) => userData)
        .catch(() => console.log('Not signed in'));
  }

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          getUser().then((userData) => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  console.log('oAuthUser = ', oAuthUser);

  return (
    <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} user={user} />
        <StatusBar />
    </SafeAreaProvider>
  );
}

export default withOAuth(App);
