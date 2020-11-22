import React, { useContext, useState } from 'react';
import { FlatList, SectionList, StyleSheet } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import { Text, View } from '../components/Themed';
import GlobalContext from '../utils/context';
import { Icon, ListItem } from 'react-native-elements';
import OverlayInputModal from '../components/OverlayInputModal';

function FriendsScreen({ navigation, oAuthUser }) {
    const { userFollowing, userGroups, createNewGroup } = useContext(
        GlobalContext
    );
    const [showCreateNewGroupModal, setShowCreateNewGroupModal] = useState(
        false
    );
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);

    const sectionData = [
        {
            title: 'Groups',
            data: userGroups,
        },
        { title: 'Following', data: userFollowing },
    ];

    const renderItem = ({ item, section }) => {
        const itemTitle = section.title === 'Following' ? item : item.name;
        const itemOnPress = () => {
            if (section.title === 'Following') {
                navigation.navigate('Social', {
                    screen: 'FriendProfile',
                    params: {
                        displayUsername: item,
                    },
                });
            } else {
                navigation.navigate('Social', {
                    screen: 'Group',
                    params: {
                        groupId: item.id,
                    },
                });
            }
        };

        return (
            <ListItem bottomDivider onPress={itemOnPress}>
                <ListItem.Content style={styles.resultsItem}>
                    <ListItem.Title style={styles.profileItem}>
                        {itemTitle}
                    </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    };

    const renderSectionHeader = (title) => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
                {title === 'Groups' && (
                    <Icon
                        name={'ios-add'}
                        type={'ionicon'}
                        size={34}
                        onPress={() => setShowCreateNewGroupModal(true)}
                    />
                )}
            </View>
        );
    };

    const handleCreateNewGroup = async (groupName) => {
        setCreatingNewGroup(true);

        await createNewGroup(
            groupName,
            oAuthUser.attributes['custom:display_username']
        );

        setShowCreateNewGroupModal(false);
        setCreatingNewGroup(false);
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={sectionData}
                keyExtractor={(item) => item.id || item}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) =>
                    renderSectionHeader(title)
                }
                style={{ width: '100%' }}
            />
            <OverlayInputModal
                title={'Create New Group'}
                showOverlay={showCreateNewGroupModal}
                inputLabel={'Group Name'}
                onBackdropPress={() => setShowCreateNewGroupModal(false)}
                onSubmitPress={handleCreateNewGroup}
                buttonLoading={creatingNewGroup}
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
    sectionHeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingRight: 14,
        backgroundColor: '#efefef',
    },
    sectionHeaderText: {
        fontSize: 18,
        paddingLeft: 14,
        paddingRight: 14,
    },
});

export default withOAuth(FriendsScreen);
