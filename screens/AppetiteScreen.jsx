import React, { useContext } from 'react';
import { Image, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import GlobalContext from '../utils/context';

export default function AppetiteScreen() {
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
    } = useContext(GlobalContext);

    return (
        <View style={styles.container}>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
            <Text>User Appetite:</Text>
            {userAppetite.map((a) => (
                <Text key={a}>{a}</Text>
            ))}
        </View>
    );
}

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
