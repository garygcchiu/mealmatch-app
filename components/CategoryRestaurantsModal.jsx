import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import GlobalContext from '../utils/context';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { View } from './Themed';
import Loader from './Loader';
import * as categoriesApi from '../api/categories';
import RestaurantList from './RestaurantList';

export default function CategoryRestaurantsModal({ navigation }) {
    const { selectedCategoryId, setSelectedCategoryId } = useContext(
        GlobalContext
    );
    const [foursquareData, setFoursquareData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (!!selectedCategoryId) {
                try {
                    setLoading(true);
                    const res = await categoriesApi.getCategoryRestaurants(
                        selectedCategoryId
                    );
                    console.log('res = ', res);
                    setFoursquareData(res.response);
                } catch (err) {
                    console.log('getCategoryRestaurants error: ', err);
                } finally {
                    setLoading(false);
                }
            }
        })();
    }, [selectedCategoryId]);

    return (
        <SwipeablePanel
            isActive={!!selectedCategoryId}
            onClose={() => setSelectedCategoryId('')}
            fullWidth={true}
            closeOnTouchOutside={true}
            openLarge={true}
            onlyLarge={true}
            showCloseButton={true}
        >
            <View style={styles.content}>
                <Loader
                    loading={loading}
                    loaderContainerStyle={{ marginTop: 150 }}
                >
                    <RestaurantList data={foursquareData} />
                </Loader>
            </View>
        </SwipeablePanel>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    content: {
        paddingTop: 10,
    },
});
