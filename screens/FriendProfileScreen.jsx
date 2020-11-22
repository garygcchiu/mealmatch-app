import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, Icon, Avatar, Button } from 'react-native-elements';
import { withOAuth } from 'aws-amplify-react-native';

import { View, Text } from '../components/Themed';
import { getMutualAppetite } from '../api/user';
import CategoryList from '../components/CategoryList';
import Categories from '../data/categories';
import OverlayModal from '../components/OverlayModal';
import GlobalContext from '../utils/context';

function FriendProfileScreen(props) {
    const { navigation, route, oAuthUser } = props;
    const profileUser = route.params.displayUsername;
    const [loading, setLoading] = useState(false);
    const [followToggleLoading, setFollowToggleLoading] = useState(false);
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const [mutualAppetite, setMutualAppetite] = useState([]);
    const { unfollowUser, userFollowing, followUser } = useContext(
        GlobalContext
    );

    const isUserFollowing = userFollowing.includes(profileUser);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: ``,
        });
    }, [navigation]);

    const handleCompareAppetitePress = async () => {
        setLoading(true);
        const mutualAppetiteRes = await getMutualAppetite(
            profileUser,
            oAuthUser.attributes['custom:display_username']
        );

        setMutualAppetite([
            {
                title: "What You're Both Feeling",
                data: Categories.filter(
                    ({ id, supported_countries }) =>
                        mutualAppetiteRes.includes(id) &&
                        !supported_countries.length
                ),
            },
        ]);
        setLoading(false);
    };

    const handleFollowToggleButtonPress = async () => {
        if (isUserFollowing) {
            setShowUnfollowModal(true);
        } else {
            setFollowToggleLoading(true);
            await followUser(profileUser);
            setFollowToggleLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Avatar
                size={'large'}
                icon={{ name: 'user', type: 'font-awesome' }}
                rounded
                containerStyle={styles.avatarContainer}
            />
            <Text style={styles.username}>@{profileUser}</Text>
            <Button
                type="outline"
                title={isUserFollowing ? 'Following' : 'Follow'}
                containerStyle={styles.buttons}
                onPress={handleFollowToggleButtonPress}
                loading={followToggleLoading}
            />
            <Button
                type="solid"
                title={'Compare Appetite!'}
                buttonStyle={styles.compareButton}
                iconRight={true}
                icon={
                    <Icon
                        type={'ionicon'}
                        name={'ios-rocket'}
                        color={'white'}
                        containerStyle={styles.rocketIcon}
                    />
                }
                onPress={handleCompareAppetitePress}
            />
            {loading ? (
                <ActivityIndicator
                    size={'large'}
                    style={styles.resultsLoader}
                />
            ) : (
                <View style={styles.resultsList}>
                    <CategoryList
                        categories={mutualAppetite}
                        showClearAllButton={false}
                        showActionButton={false}
                    />
                </View>
            )}
            <OverlayModal
                title={'Unfollow'}
                description={'Are you sure you want to unfollow this user?'}
                showOverlay={showUnfollowModal}
                onCancelPress={() => setShowUnfollowModal(false)}
                onConfirmPress={() => {
                    unfollowUser(profileUser);
                    setShowUnfollowModal(false);
                }}
                onBackdropPress={() => setShowUnfollowModal(false)}
            />
        </View>
    );
}

export default withOAuth(FriendProfileScreen);

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
        marginBottom: 6,
    },
    username: {
        fontSize: 16,
    },
    buttons: {
        marginVertical: 12,
    },
    compareButton: {
        borderRadius: 12,
        height: 50,
        width: 220,
    },
    rocketIcon: {
        marginLeft: 10,
    },
    resultsLoader: {
        height: '60%',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    resultsList: {
        marginTop: 10,
    },
});
