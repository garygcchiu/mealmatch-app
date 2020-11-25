const { standardGet, standardPost } = require('./base');

export async function createNewGroup(groupName, userDisplayUsername) {
    return standardPost('/groups/create', {
        group_name: groupName,
        user_display_username: userDisplayUsername,
    });
}

export async function getGroupInfo(groupId) {
    return standardGet('/groups/view', { groupId });
}

export async function getGroupMutualAppetite(groupId) {
    return standardGet('/groups/mutual-appetite', { groupId });
}

export async function inviteUserToGroup(userId, groupId, groupName, invitedBy) {
    return standardPost('/groups/invite', {
        user_id: userId,
        group_id: groupId,
        group_name: groupName,
        invited_by: invitedBy,
    });
}

export async function kickUserFromGroup(userId, groupId) {
    return standardPost('/groups/kick', {
        user_id: userId,
        group_id: groupId,
    });
}
