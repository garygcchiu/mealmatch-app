import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { View } from '../components/Themed';
import { useLayoutEffect } from 'react';
import { ListItem, Icon } from 'react-native-elements';
import { withOAuth } from 'aws-amplify-react-native';

function SettingsScreen(props) {
    const { oAuthUser, signOut, navigation, route } = props;

    const SETTINGS = [
        {
            title: 'About',
            onPress: (item) => {
                console.log('pressed!!!');
            },
        },
        {
            title: 'Privacy Policy',
            onPress: (item) => {
                console.log('pressed!!!');
            },
        },
        {
            title: 'Terms of Service',
            onPress: (item) => {
                console.log('pressed!!!');
            },
        },
        {
            title: 'Support',
            onPress: (item) => {
                console.log('pressed!!!');
            },
        },
        {
            title: 'Sign Out',
            onPress: () => {
                signOut();
            },
        },
    ];

    const renderItem = ({ item }) => (
        <ListItem bottomDivider key={item.title} onPress={item.onPress}>
            <ListItem.Content>
                <ListItem.Title style={styles.profileItem}>
                    {item.title}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={SETTINGS}
                keyExtractor={(item) => item.title}
                renderItem={renderItem}
                style={{ width: '100%' }}
            />
        </View>
    );
}

export default withOAuth(SettingsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
    },
    profileItem: {
        color: 'black',
    },
    headerSettings: {
        marginRight: 10,
    },
});
