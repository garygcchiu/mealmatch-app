import React, { useContext, useLayoutEffect, useState } from 'react';
import { FlatList, Modal, SectionList, StyleSheet } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import { Text, View } from '../components/Themed';
import GlobalContext from '../utils/context';
import { Icon, ListItem, Badge, Button } from 'react-native-elements';
import OverlayInputModal from '../components/OverlayInputModal';
import { SwipeablePanel } from 'rn-swipeable-panel';

function FriendsScreen({ navigation, oAuthUser }) {
    const {
        userFollowing,
        userGroups,
        createNewGroup,
        userGroupInvites,
        answerGroupInvite,
    } = useContext(GlobalContext);
    const [showCreateNewGroupModal, setShowCreateNewGroupModal] = useState(
        false
    );
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);
    const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
    const [acceptingGroups, setAcceptingGroups] = useState([]);
    const [decliningGroups, setDecliningGroups] = useState([]);

    const sectionData = [
        {
            title: 'Groups',
            data: userGroups,
        },
        { title: 'Following', data: userFollowing },
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.notifications}>
                    <Icon
                        name={'ios-notifications-outline'}
                        type={'ionicon'}
                        size={32}
                        onPress={() => setShowNotificationsPanel(true)}
                    />
                    {userGroupInvites.length ? (
                        <Badge
                            size={24}
                            containerStyle={{
                                position: 'absolute',
                                top: -4,
                                right: -8,
                            }}
                            status={'primary'}
                            value={userGroupInvites.length}
                        />
                    ) : null}
                </View>
            ),
            headerTitle: 'Social',
        });
    }, [navigation, userGroupInvites]);

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

    const handleAcceptGroupInvite = async (groupId, groupName) => {
        setAcceptingGroups([...acceptingGroups, groupId]);

        try {
            await answerGroupInvite(groupId, groupName, true);
        } catch (err) {
            console.log('accept group error: ', err);
        }

        setAcceptingGroups([...acceptingGroups.filter((g) => g !== groupId)]);
    };

    const handleDeclineGroupInvite = async (groupId, groupName) => {
        setDecliningGroups([...decliningGroups, groupId]);

        try {
            await answerGroupInvite(groupId, groupName, false);
        } catch (err) {
            console.log('decline group error: ', err);
        }

        setDecliningGroups([...decliningGroups.filter((g) => g !== groupId)]);
    };

    const renderGroupInvite = ({ item }) => (
        <ListItem bottomDivider>
            <ListItem.Content style={styles.resultsItem}>
                <ListItem.Title style={styles.profileItem}>
                    {item.group_name}
                </ListItem.Title>
                <View style={styles.notifButtons}>
                    <Button
                        type="outline"
                        title={'Accept'}
                        loading={acceptingGroups.includes(item.group_id)}
                        onPress={() =>
                            handleAcceptGroupInvite(
                                item.group_id,
                                item.group_name
                            )
                        }
                        style={{ marginRight: 14 }}
                    />
                    <Button
                        type="outline"
                        title={'Decline'}
                        loading={decliningGroups.includes(item.group_id)}
                        loadingProps={styles.declineGroupInviteButton}
                        onPress={() =>
                            handleDeclineGroupInvite(
                                item.group_id,
                                item.group_name
                            )
                        }
                        buttonStyle={styles.declineGroupInviteButton}
                        titleStyle={styles.declineGroupInviteButton}
                    />
                </View>
            </ListItem.Content>
        </ListItem>
    );

    const renderNoContent = ({ section }) =>
        section.title === 'Groups'
            ? section.data.length === 0 && (
                  <View style={styles.emptySectionContainer}>
                      <Text style={styles.emptySectionText}>
                          No groups found! Tap the + sign to create a group!
                      </Text>
                  </View>
              )
            : section.data.length === 0 && (
                  <View style={styles.emptySectionContainer}>
                      <Text style={styles.emptySectionText}>
                          You're not following anyone! Use the Search function
                          to search for your users!
                      </Text>
                  </View>
              );

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
                renderSectionFooter={renderNoContent}
            />
            <OverlayInputModal
                title={'Create New Group'}
                showOverlay={showCreateNewGroupModal}
                inputLabel={'Group Name'}
                onBackdropPress={() => setShowCreateNewGroupModal(false)}
                onSubmitPress={handleCreateNewGroup}
                buttonLoading={creatingNewGroup}
            />
            <Modal
                visible={showNotificationsPanel}
                animated={false}
                transparent={true}
            >
                <SwipeablePanel
                    isActive={showNotificationsPanel}
                    onClose={() => setShowNotificationsPanel(false)}
                    fullWidth={true}
                    closeOnTouchOutside={true}
                    onlySmall={true}
                >
                    <View>
                        {userGroupInvites.length ? (
                            <FlatList
                                data={userGroupInvites}
                                keyExtractor={(item) => item.group_id}
                                renderItem={renderGroupInvite}
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>
                                    No invitations to groups
                                </Text>
                            </View>
                        )}
                    </View>
                </SwipeablePanel>
            </Modal>
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
    notifications: {
        marginRight: 14,
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
    resultsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notifButtons: {
        flexDirection: 'row',
    },
    declineGroupInviteButton: {
        color: 'red',
        borderColor: 'red',
    },
    emptySectionContainer: {
        height: 50,
    },
    emptySectionText: {
        color: '#8e8e8f',
        paddingLeft: 14,
        marginTop: 16,
    },
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: 14,
    },
    noResultsText: {
        color: '#8e8e8f',
        fontSize: 20,
    },
});

export default withOAuth(FriendsScreen);
