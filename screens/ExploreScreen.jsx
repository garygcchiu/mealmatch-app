import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Fuse from 'fuse.js';
import { SearchBar, Button, Icon } from 'react-native-elements';

import useColorScheme from '../hooks/useColorScheme';
import Categories from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import { View } from '../components/Themed';

const searchOptions = {
    includeScore: true,
    shouldSort: true,
    keys: ['name'],
};

const fuse = new Fuse(Categories, searchOptions);

const renderCategory = ({ item }) => {
    return <CategoryCard title={item.title} image={item.image} />;
};

const categoriesDefaultSort = (a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

export default function ExploreScreen({ navigation }) {
    const colorScheme = useColorScheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(
        Categories.sort(categoriesDefaultSort)
    );
    const [showSearch, setShowSearch] = useState(false);

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

    const updateSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            setCategories(fuse.search(text).map((c) => c.item));
        } else {
            setCategories(Categories);
        }
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
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
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
