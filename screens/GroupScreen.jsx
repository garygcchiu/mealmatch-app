import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { View, Text } from '../components/Themed';
import { useLayoutEffect } from 'react';
import { ListItem, Icon } from 'react-native-elements';
import { withOAuth } from 'aws-amplify-react-native';

function GroupScreen(props) {
    const { oAuthUser, signOut, navigation, route } = props;
    const { groupId } = route.params;

    return (
        <View style={styles.container}>
            <Text>hehehe {groupId}</Text>
        </View>
    );
}

export default GroupScreen;

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
