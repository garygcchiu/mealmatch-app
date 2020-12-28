import React, { useState } from 'react';
import { Alert, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { withOAuth } from 'aws-amplify-react-native';

import { View, Text } from './Themed';

const GroupMemberActions = ({
    visible,
    handleClose,
    isRequestLoading,
    handleVisitProfile,
    member,
    oAuthUser,
    isCurrentUserAdmin,
    handleKickUser,
    handleLeaveGroup,
}) => {
    const closeModal = () => {
        setTimeout(() => {
            handleClose();
        }, 200);
    };

    const showLeaveGroupAlert = () => {
        Alert.alert(
            'Leave Group',
            `Are you sure you want to leave this group? ${
                isCurrentUserAdmin
                    ? 'As the administrator, if you leave the group, the group will be deleted.'
                    : ''
            }`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => handleLeaveGroup() },
            ],
            { cancelable: true }
        );
    };

    const showRemoveUserFromGroupAlert = () => {
        Alert.alert(
            'Remove User',
            `Are you sure you want to remove ${member.display_username} from the group?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => handleKickUser(member.id) },
            ],
            { cancelable: true }
        );
    };

    return (
        <Modal visible={visible} animationType={'fade'} transparent={true}>
            <SwipeablePanel
                isActive={visible}
                onClose={closeModal}
                fullWidth={true}
                closeOnTouchOutside={true}
                openLarge={false}
                onlySmall={true}
            >
                <View style={styles.memberActions}>
                    <Text style={styles.memberUsername}>
                        @{member.display_username}
                    </Text>
                    {member.is_admin && (
                        <Text style={styles.adminText}>
                            This user is the administrator of the group
                        </Text>
                    )}
                    {!member.confirmed && (
                        <Text style={styles.adminText}>
                            This user has been invited to join the group!
                        </Text>
                    )}
                    {member.id !== oAuthUser?.attributes?.sub ? ( // Not Current User
                        <View style={styles.notCurrentUserButtons}>
                            <Button
                                type="outline"
                                title={'Visit Profile'}
                                loading={isRequestLoading}
                                onPress={() =>
                                    handleVisitProfile(
                                        member.id,
                                        member.display_username
                                    )
                                }
                            />
                            {isCurrentUserAdmin && ( // Current User is an Admin, can kick
                                <Button
                                    type="outline"
                                    title={'Remove User From Group'}
                                    loading={isRequestLoading}
                                    onPress={() =>
                                        showRemoveUserFromGroupAlert()
                                    }
                                    containerStyle={styles.kickButton}
                                    buttonStyle={styles.leaveGroup}
                                    titleStyle={styles.leaveGroup}
                                />
                            )}
                        </View>
                    ) : (
                        // Current User
                        <Button
                            type="outline"
                            title={'Leave Group'}
                            loading={isRequestLoading}
                            onPress={() => showLeaveGroupAlert()}
                            buttonStyle={styles.leaveGroup}
                            titleStyle={styles.leaveGroup}
                        />
                    )}
                </View>
            </SwipeablePanel>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {},
    outerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    memberActions: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        marginVertical: 14,
    },
    memberUsername: {
        color: '#8e8e8f',
        fontSize: 20,
    },
    adminText: {
        color: '#8e8e8f',
        fontSize: 14,
        marginTop: 14,
        marginBottom: 14,
    },
    leaveGroup: {
        color: 'red',
        borderColor: 'red',
    },
    kickButton: {
        marginTop: 14,
    },
    notCurrentUserButtons: {
        height: '100%',
        marginTop: 24,
    },
});

export default withOAuth(GroupMemberActions);
