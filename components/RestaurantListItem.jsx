import React from 'react';
import { StyleSheet } from 'react-native';
import { showLocation } from 'react-native-map-link';
import * as Linking from 'expo-linking';
import { Button, Icon, SocialIcon } from 'react-native-elements';

import { Text, View } from './Themed';

export default function RestaurantListItem({
    name,
    formattedAddress,
    latitude,
    longitude,
    showUberButton,
}) {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.restaurantName}>{name}</Text>
                {formattedAddress.map((a) => (
                    <Text key={a} style={styles.addressText}>
                        {a}
                    </Text>
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <Button
                    icon={
                        <Icon
                            title={'Maps'}
                            name={'map-marker-alt'}
                            type={'font-awesome-5'}
                        />
                    }
                    onPress={() =>
                        showLocation({
                            latitude,
                            longitude,
                            title: name,
                        })
                    }
                    buttonStyle={styles.linksButtonContainer}
                />
                {true && (
                    <Button
                        icon={<Icon name={'uber'} type={'font-awesome-5'} />}
                        buttonStyle={styles.linksButtonContainer}
                    />
                )}
                <Button
                    icon={
                        <Icon
                            name={'google'}
                            type={'font-awesome-5'}
                            size={20}
                        />
                    }
                    buttonStyle={styles.linksButtonContainer}
                    onPress={() =>
                        Linking.openURL(`https://google.ca/search?q=${name}`)
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        borderStyle: 'solid',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        width: '55%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    restaurantName: {
        fontWeight: 'bold',
    },
    addressText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    linksButtonContainer: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        height: 40,
        width: 40,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        marginHorizontal: 4,
    },
});
