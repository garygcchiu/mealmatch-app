import React, { useEffect, useContext } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { withOAuth } from 'aws-amplify-react-native';
import { Auth, Hub } from 'aws-amplify';
import GlobalContext from '../context/GlobalContext';

function getUser() {
    return Auth.currentAuthenticatedUser()
        .then((userData) => userData)
        .catch(() => console.log('Not signed in'));
}
function AuthScreen(props) {
    const { googleSignIn } = props;
    const { user, setUser } = useContext(GlobalContext);

    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                    console.log('signing in!!!!!');
                    getUser().then((userData) => setUser(userData));
                    break;
                case 'signOut':
                    console.log('signing out!!!');
                    setUser(null);
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Button title={'Sign In With Google'} onPress={googleSignIn} />
        </View>
    );
}

export default withOAuth(AuthScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
