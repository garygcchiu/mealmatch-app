const { standardGet, standardPost } = require('./base');
import { Storage, Auth } from 'aws-amplify';
import * as ImageManipulator from 'expo-image-manipulator';

export async function editAppetite(appetite) {
    return standardPost('/users/appetite', appetite);
}

export async function submitUsername(displayUsername) {
    return standardPost('/users/submit-username', {
        display_username: displayUsername,
    });
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

export async function submitAvatar(photo, username, progressCallback) {
    // resize photo to thumbnail size
    const { uri } = await ImageManipulator.manipulateAsync(photo.uri, [
        {
            resize: { height: 80, width: 80 },
        },
    ]);

    // fetch from filesystem
    const response = await fetch(
        Platform.OS === 'android' ? uri : uri.split('file://').pop()
    );
    const blob = await response.blob();

    // upload to s3
    const uploadRes = await Storage.put(`${username}_avatar.jpg`, blob, {
        contentType: 'image/jpg',
        level: 'public',
        progressCallback(progress) {
            if (progressCallback) {
                progressCallback(progress);
            }
        },
    });

    if (uploadRes.key) {
        const avatarS3url = `mealmatch-assets/protected/${
            (await Auth.currentUserCredentials()).identityId
        }/${uploadRes.key}`;

        // save s3 url to dynamodb
        return standardPost('/users/avatar', { avatarUrl: avatarS3url });
    }
}
