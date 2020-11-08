import React, { useContext } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { withOAuth } from 'aws-amplify-react-native';

function AuthScreen(props) {
    const { googleSignIn, hostedUISignIn } = props;

    return (
        <View style={styles.container}>
            <>
                {/* Go to the Cognito Hosted UI */}
                <Button title="Cognito" onPress={hostedUISignIn} />

                {/* Go directly to a configured identity provider */}
                <Button title="Google" onPress={googleSignIn} />
            </>
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
