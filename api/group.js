const { standardGet, standardPost } = require('./base');

export async function createNewGroup(groupName, userDisplayUsername) {
    return standardPost('/groups/create', {
        group_name: groupName,
        user_display_username: userDisplayUsername,
    });
}
