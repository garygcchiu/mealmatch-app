import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import * as Linking from 'expo-linking';

import Categories from '../data/categories';
import { Text, View } from './Themed';
import GlobalContext from '../utils/context';
import RestaurantListItem from './RestaurantListItem';

export default function RestaurantList({ data }) {
    const { selectedCategoryId } = useContext(GlobalContext);
    const [canOpenUber, setCanOpenUber] = useState(true);
    const categoryName = getPrimaryCategoryInData(data, selectedCategoryId);

    useEffect(() => {
        Linking.canOpenURL('uber://').then((res) => setCanOpenUber(res));
    }, []);

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
                            formattedAddress={
                                item.venue.location.formattedAddress
                            }
                            key={item.venue.id}
                            latitude={item.venue.location.lat}
                            longitude={item.venue.location.lng}
                            showUberButton={canOpenUber}
                        />
                    ))}
                </View>
            ))}
            <View style={styles.foursquareContainer}>
                <Text style={styles.foursquareText}>
                    Data obtained from Foursquare.com
                </Text>
            </View>
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
        marginBottom: 14,
    },
    foursquareContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foursquareText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
});
