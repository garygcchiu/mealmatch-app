import React, { useContext, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import * as searchApi from '../api/search';
import { View, Text } from '../components/Themed';
import { ListItem, SearchBar, Button } from 'react-native-elements';
import GlobalContext from '../utils/context';
import ListHeader from '../components/ListHeader';
import Loader from '../components/Loader';

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState([]);

    const { followUser, userFollowing } = useContext(GlobalContext);

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

    const handleFollowPress = async (userId, displayUsername) => {
        setIsRequestLoading([...isRequestLoading, displayUsername]);

        await followUser(userId, displayUsername);

        setIsRequestLoading([
            ...isRequestLoading.filter((du) => du !== displayUsername),
        ]);
    };

    const renderUserItem = ({ item }) => (
        <ListItem
            bottomDivider
            key={item.id}
            onPress={() =>
                navigation.navigate('Social', {
                    screen: 'FriendProfile',
                    params: {
                        userId: item.id,
                        displayUsername: item.display_username,
                    },
                })
            }
        >
            <ListItem.Content style={styles.resultsItem}>
                <ListItem.Title>{item.display_username}</ListItem.Title>
                {userFollowing.filter((uf) => uf.id === item.id).length ? (
                    <Button type="outline" title={'Following'} />
                ) : (
                    <Button
                        type="outline"
                        title={'Follow'}
                        loading={isRequestLoading.includes(
                            item.display_username
                        )}
                        onPress={() =>
                            handleFollowPress(item.id, item.display_username)
                        }
                    />
                )}
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
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
            <Loader
                loading={searching}
                noResults={searchResults?.users?.length === 0}
                noResultsMessage={'No Results Found'}
            >
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
            </Loader>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
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
    resultsContainer: {
        width: '100%',
        display: 'flex',
    },
    resultsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
