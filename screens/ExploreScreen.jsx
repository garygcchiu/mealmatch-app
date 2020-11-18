import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, SectionList, SafeAreaView } from 'react-native';
import Fuse from 'fuse.js';
import { SearchBar, Button, Icon } from 'react-native-elements';

import useColorScheme from '../hooks/useColorScheme';
import Categories from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import { View, Text } from '../components/Themed';
import GlobalContext from '../utils/context';
import ExploreFilter from '../components/ExploreFilter';
import { filterMap } from '../data/filterOptions';

const searchOptions = {
    includeScore: true,
    shouldSort: true,
    isCaseSensitive: false,
    findAllMatches: true,
    keys: ['name'],
};

let fuse;

export default function ExploreScreen({ navigation }) {
    const colorScheme = useColorScheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState(
        filterMap.POPULAR
    );
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
        fetchUserAppetite,
    } = useContext(GlobalContext);

    const getSectionedCategories = (filter, searchResults = []) => {
        if (filter === filterMap.POPULAR) {
            return [
                {
                    title: filter,
                    data: Categories.filter(
                        (c) => c.popular && !c.supported_countries.length
                    ),
                },
                {
                    title: 'All Categories',
                    data: Categories.filter(
                        (c) => !c.popular && !c.supported_countries.length
                    ),
                },
            ];
        }

        if (filter === filterMap.ALPHABETICAL) {
            return [
                {
                    title: filter,
                    data: Categories.filter(
                        (c) => !c.supported_countries.length
                    ).sort((a, b) =>
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                    ),
                },
            ];
        }

        if (filter === filterMap.SELECTED) {
            return [
                {
                    title: filter,
                    data: Categories.filter(({ id }) =>
                        userAppetite.includes(id)
                    ),
                },
            ];
        }

        if (filter === filterMap.UNSELECTED) {
            return [
                {
                    title: filter,
                    data: Categories.filter(
                        ({ id, supported_countries }) =>
                            !userAppetite.includes(id) &&
                            !supported_countries.length
                    ),
                },
            ];
        }

        if (filter === filterMap.SEARCH_RESULTS) {
            return [
                {
                    title: filter,
                    data: searchResults.filter((item) =>
                        selectedFilterOption === filterMap.POPULAR ||
                        selectedFilterOption === filterMap.ALPHABETICAL
                            ? !item.supported_countries.length
                            : selectedFilterOption === filterMap.SELECTED
                            ? userAppetite.includes(item.id)
                            : !userAppetite.includes(item.id)
                    ),
                },
            ];
        }
    };

    useEffect(() => {
        // initialize fuse
        const searchableCategories = Categories.filter(
            ({ supported_countries }) => !supported_countries.length
        );

        fuse = new Fuse(searchableCategories, searchOptions);

        setCategories(getSectionedCategories(selectedFilterOption));
        fetchUserAppetite();
    }, []);

    const renderCategory = (item, isInAppetite) => {
        return (
            <CategoryCard
                title={item.name}
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

    const renderSectionHeader = (title) => {
        return <Text style={styles.sectionHeader}>{title}</Text>;
    };

    const updateSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            setCategories(
                getSectionedCategories(
                    filterMap.SEARCH_RESULTS,
                    fuse.search(text).map((c) => c.item)
                )
            );
        } else {
            setCategories(getSectionedCategories(selectedFilterOption));
        }
    };

    const isInAppetite = (item) => {
        return userAppetite.filter((a) => a === item.id).length;
    };

    const handleFilterChange = (option) => {
        setCategories(getSectionedCategories(option));
        setSelectedFilterOption(option);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <View style={styles.optionsContainer}>
                        <SearchBar
                            placeholder="Search categories..."
                            onChangeText={updateSearch}
                            value={searchTerm}
                            platform={'default'}
                            autoFocus={false}
                            onCancel={() => {}}
                            containerStyle={styles.searchBarContainer}
                            showCancel={false}
                            cancelButtonTitle={''}
                            lightTheme={colorScheme === 'light'}
                            round={true}
                            inputContainerStyle={styles.searchBarInputContainer}
                            placeholderTextColor={'#737373'}
                            inputStyle={{ color: 'black' }}
                        />
                        <Button
                            icon={
                                <Icon
                                    type={'font-awesome-5'}
                                    name="filter"
                                    size={22}
                                    color={
                                        colorScheme === 'light'
                                            ? 'black'
                                            : 'white'
                                    }
                                />
                            }
                            buttonStyle={styles.optionsButton}
                            onPress={() => setShowFilter(true)}
                        />
                        <Button
                            icon={
                                <Icon
                                    type={'material-community'}
                                    name="file-document-box-remove-outline"
                                    size={22}
                                    color={
                                        colorScheme === 'light'
                                            ? 'black'
                                            : 'white'
                                    }
                                />
                            }
                            buttonStyle={styles.optionsButton}
                        />
                    </View>
                    <SectionList
                        renderItem={({ item }) =>
                            renderCategory(item, isInAppetite(item))
                        }
                        renderSectionHeader={({ section: { title } }) =>
                            renderSectionHeader(title)
                        }
                        keyExtractor={(item) => item.id}
                        numColumns={1}
                        horizontal={false}
                        style={{ width: '100%' }}
                        sections={categories}
                    />
                    <ExploreFilter
                        visible={showFilter}
                        handleClose={() => setShowFilter(false)}
                        selectedOption={selectedFilterOption}
                        handleOptionPress={(option) =>
                            handleFilterChange(option)
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
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
        height: 1,
        width: '95%',
        alignSelf: 'center',
        marginBottom: 5,
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: 64,
    },
    optionsButton: {
        backgroundColor: '#f0f0f1',
        borderRadius: 13,
        height: 45,
        width: 40,
        borderColor: '#f0f0f1',
        borderWidth: 1,
        marginLeft: 6,
        marginRight: 6,
    },
    searchBarContainer: {
        width: '75%',
        marginRight: -6,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchBarInputContainer: {
        backgroundColor: '#f0f0f1',
        color: 'black',
    },
    searchIcon: {
        backgroundColor: '#fff',
        marginRight: 6,
    },
    sectionHeader: {
        fontSize: 24,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: 'white',
        height: 50,
        paddingTop: 16,
    },
});
