import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, Button } from '../components/Themed';

function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
            <EditScreenInfo path="/screens/TabTwoScreen.js" />
            <Button
                title={'Sign Out'}
                onPress={() => Auth.signOut({ global: true })}
            />
        </View>
    );
}

export default ProfileScreen;

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
