import React, { useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import { View } from '../components/Themed';
import { useLayoutEffect } from 'react';
import { ListItem, Icon } from 'react-native-elements';

function ProfileScreen(props) {
    const { oAuthUser, signOut, navigation, route } = props;
    const { params } = route;
    const isUserProfile = params.displayUsername === '-1';

    useEffect(() => {
        console.log('Profile Params = ', params);
    }, [params]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `@${
                isUserProfile
                    ? oAuthUser?.attributes?.['custom:display_username'] || ''
                    : params.displayUsername
            }`,
            headerRight: () =>
                isUserProfile && (
                    <Icon
                        name={'ios-settings'}
                        type={'ionicon'}
                        style={styles.headerSettings}
                        onPress={() => navigation.navigate('SettingsScreen')}
                    />
                ),
        });
    }, [navigation, oAuthUser]);

    return (
        <View style={styles.container}>
            {/*<FlatList*/}
            {/*    data={[]}*/}
            {/*    keyExtractor={(item) => item.title}*/}
            {/*    renderItem={renderItem}*/}
            {/*    style={{ width: '100%' }}*/}
            {/*/>*/}
        </View>
    );
}

export default withOAuth(ProfileScreen);

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
        marginRight: 12,
    },
});
