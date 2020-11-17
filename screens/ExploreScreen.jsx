import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Fuse from 'fuse.js';
import { SearchBar, Button, Icon } from 'react-native-elements';

import useColorScheme from '../hooks/useColorScheme';
import Categories from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import { View } from '../components/Themed';
import GlobalContext from '../utils/context';

const searchableCategories = Categories.filter(
    (c) => !c.supported_countries.length
);

const searchOptions = {
    includeScore: true,
    shouldSort: true,
    isCaseSensitive: false,
    findAllMatches: true,
    keys: ['name'],
};

const fuse = new Fuse(searchableCategories, searchOptions);

const categoriesDefaultSort = (a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

export default function ExploreScreen({ navigation }) {
    const colorScheme = useColorScheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(searchableCategories);
    const [showSearch, setShowSearch] = useState(false);
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
        fetchUserAppetite,
    } = useContext(GlobalContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        setShowSearch(!showSearch);
                    }}
                    icon={
                        <Icon
                            name="md-search"
                            color={colorScheme === 'light' ? 'black' : 'white'}
                            type={'ionicon'}
                            size={28}
                        />
                    }
                    buttonStyle={styles.searchIcon}
                />
            ),
        });
    }, [navigation, showSearch]);

    useEffect(() => {
        fetchUserAppetite();
    }, []);

    const renderCategory = (item, isInAppetite) => {
        return (
            <CategoryCard
                title={item.title}
                image={item.image}
                isInAppetite={isInAppetite}
                onActionButtonPress={() =>
                    isInAppetite
                        ? removeFromUserAppetite(item.id)
                        : addToUserAppetite(item.id)
                }
            />
        );
    };

    const updateSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            setCategories(fuse.search(text).map((c) => c.item));
        } else {
            setCategories(searchableCategories);
        }
    };

    const isInAppetite = (item) => {
        return userAppetite.filter((a) => a === item.id).length;
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                {showSearch && (
                    <SearchBar
                        placeholder="Search categories or restaurants..."
                        onChangeText={updateSearch}
                        value={searchTerm}
                        platform={'ios'}
                        autoFocus={true}
                        onCancel={() => setShowSearch(false)}
                    />
                )}
                <FlatList
                    data={categories.map((c) => ({
                        id: c.id,
                        title: c.name,
                        image: c.image,
                    }))}
                    renderItem={({ item }) =>
                        renderCategory(item, isInAppetite(item))
                    }
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    horizontal={false}
                    style={{ width: '100%' }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    searchIcon: {
        backgroundColor: '#fff',
        marginRight: 6,
    },
});
