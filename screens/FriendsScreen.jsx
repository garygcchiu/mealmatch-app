import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useContext } from 'react';
import GlobalContext from '../utils/context';
import { Button, ListItem } from 'react-native-elements';

export default function FriendsScreen({ navigation }) {
    const { userFollowing } = useContext(GlobalContext);

    const renderItem = ({ item }) => (
        <ListItem
            bottomDivider
            key={item}
            onPress={() =>
                navigation.navigate('Profile', {
                    screen: 'ProfileScreen',
                    params: {
                        displayUsername: item.display_username,
                    },
                })
            }
        >
            <ListItem.Content style={styles.resultsItem}>
                <ListItem.Title style={styles.profileItem}>
                    {item}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={userFollowing}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={{ width: '100%' }}
            />
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
