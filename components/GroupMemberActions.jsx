import React, { useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { withOAuth } from 'aws-amplify-react-native';

import { View, Text } from './Themed';
import OverlayModal from './OverlayModal';

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
    isLeavingGroup,
}) => {
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
    const [showKickMemberModal, setShowKickMemberModal] = useState(false);

    const closeModal = () => {
        setTimeout(() => {
            handleClose();
        }, 200);
    };

    return (
        <Modal visible={visible} animated={false} transparent={true}>
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
                                    onPress={() => setShowKickMemberModal(true)}
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
                            onPress={() => setShowLeaveGroupModal(true)}
                            buttonStyle={styles.leaveGroup}
                            titleStyle={styles.leaveGroup}
                        />
                    )}
                    <OverlayModal
                        title={'Leave Group'}
                        description={`Are you sure you want to leave this group? ${
                            isCurrentUserAdmin
                                ? 'As the administrator, if you leave the group, the group will be deleted.'
                                : ''
                        }`}
                        showOverlay={showLeaveGroupModal}
                        onCancelPress={() => setShowLeaveGroupModal(false)}
                        onBackdropPress={() => setShowLeaveGroupModal(false)}
                        onConfirmPress={handleLeaveGroup}
                        isConfirmButtonLoading={isLeavingGroup}
                    />
                    <OverlayModal
                        title={'Remove Member'}
                        description={`Are you sure you want to remove ${member.display_username} from the group?`}
                        showOverlay={showKickMemberModal}
                        onCancelPress={() => setShowKickMemberModal(false)}
                        onBackdropPress={() => setShowKickMemberModal(false)}
                        onConfirmPress={(member) => handleKickUser(member)}
                    />
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
