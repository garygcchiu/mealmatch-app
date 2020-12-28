import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Storage } from 'aws-amplify';
import {
    launchImageLibraryAsync,
    requestCameraRollPermissionsAsync,
} from 'expo-image-picker';
import { storeData, getData } from '../utils/storage';
import { submitAvatar } from '../api/user';

function UserAvatar({
    username,
    size = 'large',
    showEdit = false,
    editSize = 25,
    avatarUpdateCallback,
    style,
}) {
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        fetchAvatar();
    }, [username]);

    const fetchAvatar = async () => {
        setAvatarUrl(
            await Storage.get(`${username}_avatar.jpg`, {
                level: 'public',
                contentType: 'image/jpg',
            })
        );
        if (avatarUpdateCallback) {
            avatarUpdateCallback(false);
        }
    };

    const showImageConsentAlert = async () => {
        Alert.alert(
            'Notice',
            'We take your privacy seriously. By uploading an image, you agree to our Privacy Policy and Terms of Service',
            [
                { text: 'Privacy Policy', onPress: () => {} },
                {
                    text: 'Terms of Service',
                    onPress: () => {},
                },
                {
                    text: 'Agree',
                    onPress: async () => {
                        await storeData('avatar_policy_acknowledged', 'true');
                        openImagePicker();
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => {},
                },
            ]
        );
    };

    const openImagePicker = async () => {
        // check camera roll permission
        let permissionResult = await requestCameraRollPermissionsAsync();
        if (permissionResult.granted === false) {
            alert(
                'Permission to access camera roll is required to update your profile picture!'
            );
            return;
        }

        // check consent acknowledgement
        if (!(await getData('avatar_policy_acknowledged'))) {
            showImageConsentAlert();
            return;
        }

        // open image picker
        let pickerResult = await launchImageLibraryAsync();
        if (pickerResult.cancelled) {
            return;
        }

        // submit to API
        if (avatarUpdateCallback) {
            avatarUpdateCallback(true);
        }

        try {
            await submitAvatar(pickerResult, username);
            fetchAvatar();
        } catch (err) {
            Alert.alert(
                'Error',
                'There was an error while trying to update your profile picture. Please try again later.',
                [{ text: 'OK', onPress: () => {} }]
            );
            console.log('submit avatar error', err.message);
        }
    };

    return (
        <Avatar
            size={size}
            icon={{ name: 'user', type: 'font-awesome' }}
            rounded
            containerStyle={[styles.avatarContainer, style]}
            source={{
                uri: avatarUrl ? avatarUrl : null,
            }}
        >
            {showEdit && (
                <Avatar.Accessory
                    name={'md-create'}
                    type={'ionicon'}
                    color={'white'}
                    size={editSize}
                    onPress={openImagePicker}
                />
            )}
        </Avatar>
    );
}

export default UserAvatar;

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    avatarContainer: {
        backgroundColor: '#cecece',
        marginBottom: 6,
    },
});
