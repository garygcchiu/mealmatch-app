const { standardGet, standardPost } = require('./base');

export async function getAppetite() {
    return standardGet(`/users/appetite`);
}

export async function editAppetite(appetite) {
    return standardPost('/users/appetite', appetite);
}

export async function editUserInfo(displayUsername) {
    return standardPost('/users/info', { display_username: displayUsername });
}

export async function followUser(userId) {
    return standardPost('/users/info', { add_following: [userId] });
}

export async function unfollowUser(userId, currentFollowing = []) {
    return standardPost('/users/info', {
        set_following: currentFollowing.filter((f) => f !== userId),
    });
}

export async function getInitUserInfo() {
    return standardGet('/users/info');
}
