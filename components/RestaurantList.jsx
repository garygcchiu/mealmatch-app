import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import Categories from '../data/categories';

import { Text, View } from './Themed';
import GlobalContext from '../utils/context';
import RestaurantListItem from './RestaurantListItem';

export default function RestaurantList({ data }) {
    const { selectedCategoryId } = useContext(GlobalContext);
    const categoryName = getPrimaryCategoryInData(data, selectedCategoryId);

    return (
        <View>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderText}>{categoryName}</Text>
                {/*<Image*/}
                {/*    style={{ height: 32, width: 32 }}*/}
                {/*    source={{ uri: getPrimaryCategoryIconUri(data) }}*/}
                {/*/>*/}
            </View>
            {(data?.groups || []).map((group) => (
                <View key={group.name}>
                    {group.items.map((item) => (
                        <RestaurantListItem
                            name={item.venue.name}
                            reason={item.reasons.items[0].summary}
                            id={item.venue.id}
                            formattedAddress={
                                item.venue.location.formattedAddress
                            }
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

function getPrimaryCategoryInData(data, selectedCategoryId) {
    return (
        data?.groups?.[0].items?.[0].venue.categories.filter(
            (c) => c.primary
        )[0].pluralName ||
        Categories.find((c) => c.id === selectedCategoryId).name
    );
}

function getPrimaryCategoryIconUri(data) {
    const {
        prefix,
        suffix,
    } = data?.groups?.[0].items?.[0].venue.categories.filter(
        (c) => c.primary
    )[0].icon;
    const dimmensions = 32;

    return `${prefix}${dimmensions}${suffix}`;
}

const styles = StyleSheet.create({
    categoryHeader: {
        paddingHorizontal: 14,
    },
    categoryHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
