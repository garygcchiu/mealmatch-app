import React, { useContext } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { Auth } from 'aws-amplify';
import GlobalContext from '../context/GlobalContext';

function AuthScreen() {
    const { user, setUser } = useContext(GlobalContext);

    return (
        <View style={styles.container}>
            <Button
                title={'Sign In With Google'}
                onPress={() => Auth.federatedSignIn({ provider: 'Google' })}
            />
        </View>
    );
}

export default AuthScreen;

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
