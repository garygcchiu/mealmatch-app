import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';

import { Text, View } from './Themed';
import ListHeader from './ListHeader';
import UserAvatar from './UserAvatar';

function UsersHorizontalList({
    users,
    onUserPress,
    showButtons,
    header,
    buttons,
    itemFooter,
}) {
    const renderUser = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.groupMemberContainer}
                onPress={() => onUserPress(item)}
            >
                <View>
                    <UserAvatar
                        size={'medium'}
                        username={item.display_username}
                    />
                    {item.is_admin && (
                        <Badge value={'A'} containerStyle={styles.adminBadge} />
                    )}
                </View>
                <Text style={styles.memberText}>
                    @{item.display_username}
                    {'\n'}
                    {itemFooter && itemFooter(item)}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ListHeader
                text={header}
                showButtons={showButtons}
                buttons={buttons}
            />
            <FlatList
                data={users}
                renderItem={renderUser}
                horizontal={true}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 14,
    },
    groupMemberContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 14,
        marginTop: 14,
    },
    groupMemberSeparator: {
        marginHorizontal: 8,
    },
    memberText: {
        textAlign: 'center',
    },
    adminBadge: {
        position: 'absolute',
        top: 0,
        right: -4,
    },
});

export default UsersHorizontalList;
