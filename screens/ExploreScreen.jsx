import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Fuse from 'fuse.js';
import { SearchBar, Button, Icon, Overlay } from 'react-native-elements';

import useColorScheme from '../hooks/useColorScheme';
import Categories from '../data/categories';
import CategoryList from '../components/CategoryList';
import { View, Text } from '../components/Themed';
import GlobalContext from '../utils/context';
import ExploreFilter from '../components/ExploreFilter';
import { filterMap } from '../data/filterOptions';
import OverlayModal from '../components/OverlayModal';
import ClearAppetiteButton from '../components/ClearAppetiteButton';

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
    const [showClearOverlay, setShowClearOverlay] = useState(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState(
        filterMap.POPULAR
    );
    const { userAppetite, clearUserAppetite } = useContext(GlobalContext);

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
    }, []);

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

    const handleFilterChange = (option) => {
        setCategories(getSectionedCategories(option));
        setSelectedFilterOption(option);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.optionsContainer}>
                    <SearchBar
                        placeholder="Search categories..."
                        onChangeText={updateSearch}
                        value={searchTerm}
                        platform={'default'}
                        autoFocus={false}
                        containerStyle={styles.searchBarContainer}
                        showCancel={false}
                        lightTheme={colorScheme === 'light'}
                        round={true}
                        inputContainerStyle={styles.searchBarInputContainer}
                        placeholderTextColor={'#737373'}
                        inputStyle={styles.searchInput}
                    />
                    <Button
                        icon={
                            <Icon
                                type={'font-awesome-5'}
                                name="filter"
                                size={22}
                                color={
                                    colorScheme === 'light' ? 'black' : 'white'
                                }
                            />
                        }
                        buttonStyle={styles.optionsButton}
                        onPress={() => setShowFilter(true)}
                    />
                    <ClearAppetiteButton
                        onButtonPress={() => setShowClearOverlay(true)}
                    />
                </View>
                <CategoryList categories={categories} />
                <ExploreFilter
                    visible={showFilter}
                    handleClose={() => setShowFilter(false)}
                    selectedOption={selectedFilterOption}
                    handleOptionPress={(option) => handleFilterChange(option)}
                />
                <OverlayModal
                    title={'Confirmation'}
                    onBackdropPress={() => setShowClearOverlay(false)}
                    onCancelPress={() => setShowClearOverlay(false)}
                    onConfirmPress={() => {
                        clearUserAppetite();
                        setShowClearOverlay(false);
                    }}
                    description={
                        'This will clear all categories from your appetite list. Are you sure?'
                    }
                    showOverlay={showClearOverlay}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    searchInput: {
        color: 'black',
    },
});
