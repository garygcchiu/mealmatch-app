import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import { View, Text } from '../components/Themed';
import * as groupsAPI from '../api/group';
import { ListItem, Icon, Avatar, Button } from 'react-native-elements';
import GlobalContext from '../utils/context';
import CompareAppetiteButton from '../components/CompareAppetiteButton';
import GroupInvitePanel from '../components/GroupInvitePanel';
import * as groupApi from '../api/group';

function GroupScreen(props) {
    const { navigation, route, oAuthUser } = props;
    const { groupId } = route.params;
    const [loadingGroupInfo, setLoadingGroupInfo] = useState(false);
    const [showGroupInvitePanel, setShowGroupInvitePanel] = useState(false);
    const [groupInfo, setGroupInfo] = useState({});
    const [fetchingGroupMembers, setFetchingGroupMembers] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [invitedUsers, setInviteUsers] = useState([]);

    const { userFollowing } = useContext(GlobalContext);

    useEffect(() => {
        setLoadingGroupInfo(true);
        fetchGroupInfo();
    }, [groupId]);

    const fetchGroupInfo = () => {
        groupsAPI.getGroupInfo(groupId).then((res) => {
            setGroupInfo(res);

            const processedMembers = [
                ...(res.members || []).map((member) => ({
                    ...member,
                    confirmed: true,
                })),
                ...(res.invited_members || []).map((member) => ({
                    ...member,
                    confirmed: false,
                })),
            ];

            // update state
            setGroupMembers(processedMembers);
            setLoadingGroupInfo(false);
            setFetchingGroupMembers(false);
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    name={'ios-settings'}
                    type={'ionicon'}
                    style={styles.headerSettings}
                />
            ),
        });
    }, [navigation]);

    const renderGroupMember = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.groupMemberContainer}
                onPress={() =>
                    item.display_username ===
                    oAuthUser.attributes['custom:display_username']
                        ? navigation.navigate('Profile')
                        : navigation.navigate('Social', {
                              screen: 'FriendProfile',
                              params: {
                                  displayUsername: item.display_username,
                              },
                          })
                }
            >
                <Avatar
                    size={'medium'}
                    icon={{ name: 'user', type: 'font-awesome' }}
                    rounded
                    containerStyle={styles.avatarContainer}
                />
                <Text style={styles.memberText}>
                    @{item.display_username}
                    {'\n'}
                    {!item.confirmed && (
                        <Text style={{ color: '#8e8e8f' }}>Invited</Text>
                    )}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleInvitePress = async (userId, displayUsername) => {
        setIsRequestLoading([...isRequestLoading, displayUsername]);

        try {
            await groupApi.inviteUserToGroup(userId, groupId, groupInfo.name);

            // update loading states
            setIsRequestLoading([
                ...isRequestLoading.filter((du) => du !== displayUsername),
            ]);
            setInviteUsers([...invitedUsers, displayUsername]);

            // fetch updated info
            fetchGroupInfo();
        } catch (err) {
            console.log('inv err ', err);
            setIsRequestLoading([
                ...isRequestLoading.filter((du) => du !== displayUsername),
            ]);
        }
    };

    return (
        <View style={styles.container}>
            {loadingGroupInfo ? (
                <ActivityIndicator size={'large'} style={{ height: '85%' }} />
            ) : (
                <View style={styles.groupInfoContainer}>
                    <Text style={styles.groupName}>{groupInfo.name}</Text>
                    <View style={styles.membersHeader}>
                        <Text style={styles.groupMembersHeader}>Members</Text>
                        <View style={styles.membersButtons}>
                            <Button
                                icon={
                                    <Icon
                                        name={'ios-refresh'}
                                        type={'ionicon'}
                                        size={24}
                                    />
                                }
                                buttonStyle={styles.refreshButton}
                                loading={fetchingGroupMembers}
                                onPress={() => {
                                    setFetchingGroupMembers(true);
                                    fetchGroupInfo();
                                }}
                            />
                            <Icon
                                name={'ios-add'}
                                type={'ionicon'}
                                size={42}
                                style={{ marginRight: 8 }}
                                onPress={() => setShowGroupInvitePanel(true)}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={groupMembers}
                        renderItem={renderGroupMember}
                        horizontal={true}
                        keyExtractor={(item) => item.user_id}
                        ItemSeparatorComponent={() => (
                            <View style={styles.groupMemberSeparator} />
                        )}
                    />
                    <View style={styles.compareAppetiteButton}>
                        <CompareAppetiteButton handleOnPress={() => {}} />
                    </View>
                    <GroupInvitePanel
                        visible={showGroupInvitePanel}
                        handleClose={() => setShowGroupInvitePanel(false)}
                        handleInvitePress={handleInvitePress}
                        invitedUsers={invitedUsers}
                        isRequestLoading={isRequestLoading}
                    />
                </View>
            )}
        </View>
    );
}

export default withOAuth(GroupScreen);

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
        marginRight: 14,
    },
    groupInfoContainer: {
        width: '100%',
        paddingTop: 18,
        padding: 14,
    },
    groupName: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 14,
    },
    avatarContainer: {
        backgroundColor: '#cecece',
        marginBottom: 8,
    },
    groupMemberContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupMemberSeparator: {
        marginHorizontal: 8,
    },
    groupMembersHeader: {
        fontSize: 16,
    },
    compareAppetiteButton: {
        alignItems: 'center',
        marginVertical: 24,
    },
    membersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#8e8e8f',
        borderBottomWidth: 1,
        marginBottom: 14,
    },
    membersButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    refreshButton: {
        backgroundColor: 'transparent',
        marginRight: 20,
    },
    memberText: {
        textAlign: 'center',
    },
});
