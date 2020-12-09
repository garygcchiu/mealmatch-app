import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from './Themed';

export default function RestaurantList({ id, reason, name, formattedAddress }) {
    return (
        <View style={{ marginBottom: 15 }} key={id}>
            <Text>
                Reasons=
                {reason}
            </Text>
            <Text>Venues:</Text>
            <Text>Name: {name}</Text>
            <Text>Address:</Text>
            {formattedAddress.map((a) => (
                <Text key={a}>{a}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({});
