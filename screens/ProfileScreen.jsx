import React, { useContext } from 'react';
import { StyleSheet, SectionList } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';

import { View } from '../components/Themed';
import { useLayoutEffect } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import GlobalContext from '../utils/context';

function ProfileScreen(props) {
    const { oAuthUser, navigation } = props;
    const { signOut } = useContext(GlobalContext);

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
            <Avatar
                size={'large'}
                icon={{ name: 'user', type: 'font-awesome' }}
                rounded
                containerStyle={styles.avatarContainer}
            />
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
    avatarContainer: {
        backgroundColor: '#cecece',
        marginBottom: 24,
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
