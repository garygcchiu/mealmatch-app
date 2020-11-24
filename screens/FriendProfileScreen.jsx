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
import CompareAppetiteButton from '../components/CompareAppetiteButton';

function FriendProfileScreen(props) {
    const { navigation, route, oAuthUser } = props;
    const { displayUsername, userId } = route.params;
    const [loading, setLoading] = useState(false);
    const [followToggleLoading, setFollowToggleLoading] = useState(false);
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const [mutualAppetite, setMutualAppetite] = useState([]);
    const { unfollowUser, userFollowing, followUser } = useContext(
        GlobalContext
    );

    const isUserFollowing =
        userFollowing.filter((uf) => uf.id === userId).length > 0;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: ``,
        });
    }, [navigation]);

    const handleCompareAppetitePress = async () => {
        setLoading(true);
        const mutualAppetiteRes = await getMutualAppetite(
            displayUsername,
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
            await followUser(userId, displayUsername);
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
            <Text style={styles.username}>@{displayUsername}</Text>
            <Button
                type="outline"
                title={isUserFollowing ? 'Following' : 'Follow'}
                containerStyle={styles.buttons}
                onPress={handleFollowToggleButtonPress}
                loading={followToggleLoading}
            />
            <CompareAppetiteButton handleOnPress={handleCompareAppetitePress} />
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
                    unfollowUser(userId);
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
    resultsLoader: {
        height: '60%',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    resultsList: {
        marginTop: 10,
        width: '100%',
    },
});
