import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import GlobalContext from '../utils/context';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { Text, View } from './Themed';
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
        console.log('category modal!!!');
        (async () => {
            if (!!selectedCategoryId) {
                try {
                    setLoading(true);
                    console.log('fetching????');
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
        <Modal
            visible={!!selectedCategoryId}
            animationType={'fade'}
            transparent={true}
        >
            <SwipeablePanel
                isActive={!!selectedCategoryId}
                onClose={() => setSelectedCategoryId('')}
                fullWidth={true}
                closeOnTouchOutside={true}
                openLarge={true}
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
        </Modal>
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
