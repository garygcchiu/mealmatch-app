import React, { useContext, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import {
    ListItem,
    Badge,
    Divider,
    SearchBar,
    Button,
} from 'react-native-elements';
import { SwipeablePanel } from 'rn-swipeable-panel';

import { View, Text } from './Themed';
import * as searchApi from '../api/search';
import GlobalContext from '../utils/context';
import UsersHorizontalList from './UsersHorizontalList';
import ListHeader from './ListHeader';

const GroupInvitePanel = ({
    visible,
    handleClose,
    handleInvitePress,
    isRequestLoading,
    invitedUsers,
}) => {
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    const { userFollowing } = useContext(GlobalContext);

    const closeModal = () => {
        setTimeout(() => {
            handleClose();
        }, 200);
    };

    const handleSearchQueryChange = (newValue) => {
        if (newValue.length > 3) {
            setSearching(true);
            searchApi
                .searchUsers(newValue)
                .then((searchRes) => {
                    console.log('search res = ', searchRes);
                    setSearchResults(searchRes.results);
                })
                .catch((err) => console.log('search error', err))
                .finally(() => {
                    setSearching(false);
                    setSearched(true);
                });
        } else {
            setSearched(false);
        }

        setQuery(newValue);
    };

    const renderUserItem = ({ item }) => (
        <ListItem bottomDivider key={item.id}>
            <ListItem.Content style={styles.resultsItem}>
                <ListItem.Title style={styles.profileItem}>
                    {item.display_username}
                </ListItem.Title>
                <Button
                    type="outline"
                    title={
                        invitedUsers.includes(item.display_username)
                            ? 'Invited!'
                            : 'Invite'
                    }
                    loading={isRequestLoading.includes(item.display_username)}
                    onPress={() =>
                        handleInvitePress(item.id, item.display_username)
                    }
                />
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <Modal visible={visible} animated={false} transparent={true}>
            <SwipeablePanel
                isActive={visible}
                onClose={closeModal}
                fullWidth={true}
                closeOnTouchOutside={true}
                openLarge={true}
            >
                <View>
                    <SearchBar
                        placeholder="Search users..."
                        onChangeText={handleSearchQueryChange}
                        value={query}
                        platform={'default'}
                        autoFocus={false}
                        autoCapitalize={'none'}
                        containerStyle={styles.searchBarContainer}
                        showCancel={false}
                        round={true}
                        inputContainerStyle={styles.searchBarInputContainer}
                        placeholderTextColor={'#737373'}
                        inputStyle={styles.searchInput}
                    />
                    <UsersHorizontalList
                        users={userFollowing}
                        onUserPress={(item) =>
                            handleInvitePress(item.id, item.display_username)
                        }
                        showButtons={false}
                        header={'Following'}
                        showConfirmation={true}
                        itemFooter={(item) => (
                            <Text style={{ color: '#8e8e8f' }}>
                                {isRequestLoading.includes(
                                    item.display_username
                                )
                                    ? 'Inviting'
                                    : invitedUsers.includes(
                                          item.display_username
                                      )
                                    ? 'Invited'
                                    : ''}
                            </Text>
                        )}
                    />
                    <ListHeader text={'Search Results'} />
                    {searching ? (
                        <ActivityIndicator
                            size={'large'}
                            style={{ height: '80%' }}
                        />
                    ) : (
                        <View style={styles.resultsContainer}>
                            {searchResults?.users?.length ? (
                                <FlatList
                                    data={searchResults.users}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderUserItem}
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                searched && (
                                    <View style={styles.noResultsContainer}>
                                        <Text style={styles.noResultsText}>
                                            No Results Found
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    )}
                </View>
            </SwipeablePanel>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {},
    outerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    divider: {
        marginTop: 10,
    },
    sortText: {
        fontSize: 22,
        marginLeft: 12,
    },
    searchBarContainer: {
        width: '100%',
        marginRight: -6,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchBarInputContainer: {
        backgroundColor: '#f0f0f1',
        color: 'black',
    },
    searchInput: {
        color: 'black',
    },
    resultsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultsContainer: {
        width: '100%',
        display: 'flex',
    },
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%',
    },
    noResultsText: {
        color: '#8e8e8f',
        fontSize: 20,
    },
});

export default GroupInvitePanel;
