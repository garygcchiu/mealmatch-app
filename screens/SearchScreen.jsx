import React, { useContext, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import * as searchApi from '../api/search';
import { View } from '../components/Themed';
import { ListItem, SearchBar, Button } from 'react-native-elements';
import GlobalContext from '../utils/context';

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [searching, setSearching] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState([]);

    const { followUser, userFollowing } = useContext(GlobalContext);

    const handleSearchQueryChange = (newValue) => {
        if (newValue.length > 3) {
            setSearching(true);
            searchApi
                .search(newValue)
                .then((searchRes) => {
                    console.log('search res = ', searchRes);
                    setSearchResults(searchRes.results);
                })
                .catch((err) => console.log('search error', err))
                .finally(() => setSearching(false));
        }

        setQuery(newValue);
    };

    const handleFollowPress = async (displayUsername) => {
        setIsRequestLoading([...isRequestLoading, displayUsername]);

        await followUser(displayUsername);

        setIsRequestLoading([
            ...isRequestLoading.filter((du) => du !== displayUsername),
        ]);
    };

    const renderUserItem = ({ item }) => (
        <ListItem
            bottomDivider
            key={item.id}
            onPress={() =>
                navigation.navigate('Friends', {
                    screen: 'FriendProfile',
                    params: {
                        displayUsername: item.display_username,
                    },
                })
            }
        >
            <ListItem.Content style={styles.resultsItem}>
                <ListItem.Title style={styles.profileItem}>
                    {item.display_username}
                </ListItem.Title>
                {userFollowing.includes(item.display_username) ? (
                    <Button type="outline" title={'Following'} />
                ) : (
                    <Button
                        type="outline"
                        title={'Follow'}
                        loading={isRequestLoading.includes(
                            item.display_username
                        )}
                        onPress={() => handleFollowPress(item.display_username)}
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
            {searching ? (
                <ActivityIndicator size={'large'} style={{ height: '80%' }} />
            ) : (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={searchResults.users}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                        style={{ width: '100%' }}
                    />
                </View>
            )}
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
    },
    resultsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
