const { standardGet, standardPost } = require('./base');

export async function editAppetite(appetite) {
    return standardPost('/users/appetite', appetite);
}

export async function editUserInfo(displayUsername) {
    return standardPost('/users/info', { display_username: displayUsername });
}

export async function followUser(userId, displayUsername) {
    return standardPost('/users/info', {
        add_following: [{ id: userId, display_username: displayUsername }],
    });
}

export async function unfollowUser(userId, currentFollowing = []) {
    return standardPost('/users/info', {
        set_following: currentFollowing.filter((f) => f.id !== userId),
    });
}

export async function getMutualAppetite(user1, user2) {
    return standardGet(`/users/appetite`, { user1, user2 });
}

export async function getInitUserInfo() {
    return standardGet('/users/info');
}

export async function respondGroupInvite(groupId, groupName, accept = false) {
    return standardPost('/users/groups/respond', {
        group_id: groupId,
        group_name: groupName,
        accept: accept,
    });
}

export async function leaveGroup(groupId) {
    return standardPost('/users/groups/leave', {
        group_id: groupId,
    });
}
