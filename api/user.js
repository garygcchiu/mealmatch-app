const { standardGet, standardPost } = require('./base');

export async function editAppetite(appetite) {
    return standardPost('/users/appetite', appetite);
}

export async function editUserInfo(displayUsername) {
    return standardPost('/users/info', { display_username: displayUsername });
}

export async function followUser(displayUsername) {
    return standardPost('/users/info', { add_following: [displayUsername] });
}

export async function unfollowUser(displayUsername, currentFollowing = []) {
    return standardPost('/users/info', {
        set_following: currentFollowing.filter((f) => f !== displayUsername),
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
