import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import * as placesApi from '../api/placesApi';
import { getCurrentLocation } from '../utils/location';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function SearchScreen() {
    useEffect(() => {
        (async () => {
            const searchResponse = await placesApi.searchPlaces(
                'Sushi',
                await getCurrentLocation()
            );
            console.log('search response = ', searchResponse);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search</Text>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
            <EditScreenInfo path="/screens/TabTwoScreen.js" />
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
