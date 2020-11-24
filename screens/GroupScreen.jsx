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
import { ListItem, Icon, Avatar, Button, Badge } from 'react-native-elements';
import GlobalContext from '../utils/context';
import CompareAppetiteButton from '../components/CompareAppetiteButton';
import GroupInvitePanel from '../components/GroupInvitePanel';
import * as groupApi from '../api/group';
import GroupMemberActions from '../components/GroupMemberActions';
import UsersHorizontalList from '../components/UsersHorizontalList';

function GroupScreen(props) {
    const { navigation, route, oAuthUser } = props;
    const { groupId } = route.params;
    const [loadingGroupInfo, setLoadingGroupInfo] = useState(false);
    const [showGroupInvitePanel, setShowGroupInvitePanel] = useState(false);
    const [groupInfo, setGroupInfo] = useState({});
    const [fetchingGroupMembers, setFetchingGroupMembers] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [invitedUsers, setInviteUsers] = useState([]);
    const [selectedGroupMember, setSelectedGroupMember] = useState(null);
    const [isLeavingGroup, setIsLeavingGroup] = useState(false);

    const { userFollowing, leaveGroup } = useContext(GlobalContext);

    useEffect(() => {
        setLoadingGroupInfo(true);
        fetchGroupInfo();
    }, [groupId]);

    useEffect(() => {
        if (groupMembers.length) {
            setIsUserAdmin(
                (groupMembers || []).filter((m) => m.is_admin)[0].id ===
                    oAuthUser?.attributes?.sub
            );
        }
    }, [groupMembers, oAuthUser]);

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
            setIsUserAdmin(
                processedMembers.filter((m) => m.is_admin)[0].id ===
                    oAuthUser?.attributes?.sub
            );
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

    const handleVisitProfile = (userId, displayUsername) => {
        setSelectedGroupMember(null);
        navigation.navigate('Social', {
            screen: 'FriendProfile',
            params: {
                userId,
                displayUsername,
            },
        });
    };

    const handleLeaveGroup = async () => {
        setIsLeavingGroup(true);
        console.log('leaving group...');
        await leaveGroup(groupId);
        setIsLeavingGroup(false);
        setSelectedGroupMember(null);
        navigation.navigate('Social', {
            screen: 'SocialScreen',
        });
    };

    const handleKickUser = async (userId) => {
        console.log('kicking user ', userId);
    };

    return (
        <View style={styles.container}>
            {loadingGroupInfo ? (
                <ActivityIndicator size={'large'} style={{ height: '85%' }} />
            ) : (
                <View style={styles.groupInfoContainer}>
                    <Text style={styles.groupName}>{groupInfo.name}</Text>
                    <UsersHorizontalList
                        users={groupMembers}
                        onUserPress={(item) => setSelectedGroupMember(item)}
                        showButtons={isUserAdmin}
                        header={'Members'}
                        showConfirmation={true}
                        buttons={
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
                                    onPress={() =>
                                        setShowGroupInvitePanel(true)
                                    }
                                />
                            </View>
                        }
                        itemFooter={(item) =>
                            !item.confirmed && (
                                <Text style={{ color: '#8e8e8f' }}>
                                    Invited
                                </Text>
                            )
                        }
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
                    <GroupMemberActions
                        visible={!!selectedGroupMember}
                        isRequestLoading={false}
                        member={selectedGroupMember || {}}
                        handleClose={() => setSelectedGroupMember(null)}
                        handleVisitProfile={handleVisitProfile}
                        isCurrentUserAdmin={isUserAdmin}
                        handleKickUser={handleKickUser}
                        handleLeaveGroup={handleLeaveGroup}
                        isLeavingGroup={isLeavingGroup}
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
    },
    groupName: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 14,
    },
    compareAppetiteButton: {
        alignItems: 'center',
        marginVertical: 24,
    },
    membersButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    refreshButton: {
        backgroundColor: 'transparent',
        marginRight: 20,
    },
});
