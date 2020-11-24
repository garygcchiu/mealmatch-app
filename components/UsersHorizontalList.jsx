import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import { Text, View } from './Themed';
import ListHeader from './ListHeader';

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
                <Avatar
                    size={'medium'}
                    icon={{ name: 'user', type: 'font-awesome' }}
                    rounded
                    containerStyle={styles.avatarContainer}
                />
                {item.is_admin && (
                    <Badge value={'A'} containerStyle={styles.adminBadge} />
                )}
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
    avatarContainer: {
        backgroundColor: '#cecece',
        marginBottom: 8,
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
        right: 4,
    },
});

export default UsersHorizontalList;
