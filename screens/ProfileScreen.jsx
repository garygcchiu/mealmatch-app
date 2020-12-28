import React, { useContext, useLayoutEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import { StyleSheet, SectionList } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';
import * as Progress from 'expo-progress';

import { View } from '../components/Themed';
import GlobalContext from '../utils/context';
import UserAvatar from '../components/UserAvatar';

function ProfileScreen(props) {
    const { oAuthUser, navigation } = props;
    const { signOut } = useContext(GlobalContext);
    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `@${
                oAuthUser?.attributes?.['custom:display_username'] || ''
            }`,
        });
    }, [navigation, oAuthUser]);

    const PROFILE_ITEMS = [
        {
            title: 'User',
            data: [
                {
                    title: 'View Appetite',
                    onPress: () => {
                        navigation.navigate('Appetite');
                    },
                },
                {
                    title: 'View Following',
                    onPress: () => {
                        navigation.navigate('Social');
                    },
                },
                {
                    title: 'Sign Out',
                    onPress: () => {
                        signOut();
                    },
                },
            ],
        },
        {
            title: 'MealMatch',
            data: [
                {
                    title: 'About',
                    onPress: (item) => {
                        console.log('pressed!!!');
                    },
                },
                {
                    title: 'Privacy Policy',
                    onPress: (item) => {
                        console.log('pressed!!!');
                    },
                },
                {
                    title: 'Terms of Service',
                    onPress: (item) => {
                        console.log('pressed!!!');
                    },
                },
                {
                    title: 'Support',
                    onPress: (item) => {
                        console.log('pressed!!!');
                    },
                },
            ],
        },
    ];

    const renderItem = ({ item }) => (
        <ListItem bottomDivider key={item.title} onPress={item.onPress}>
            <ListItem.Content>
                <ListItem.Title style={styles.profileItem}>
                    {item.title}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <UserAvatar
                size={'large'}
                username={oAuthUser?.attributes?.['custom:display_username']}
                showEdit={true}
                editSize={25}
                avatarUpdateCallback={(isUpdating) =>
                    setIsAvatarUpdating(isUpdating)
                }
                style={{ marginBottom: 18 }}
            />
            {isAvatarUpdating && (
                <Progress.Bar
                    isIndeterminate={true}
                    color={'orange'}
                    borderRadius={2}
                    height={2}
                />
            )}
            <SectionList
                sections={PROFILE_ITEMS}
                renderItem={renderItem}
                style={{ width: '100%' }}
                renderSectionHeader={() => (
                    <View style={styles.sectionDivider} />
                )}
                keyExtractor={(item) => item.title}
            />
        </View>
    );
}

export default withOAuth(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        paddingTop: '5%',
    },
    profileItem: {
        color: 'black',
    },
    headerSettings: {
        marginRight: 12,
    },
    sectionDivider: {
        height: 10,
        backgroundColor: '#efefef',
    },
});
