import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from './Themed';
import CategoryRestaurantsModal from './CategoryRestaurantsModal';

export default function GlobalModals() {
    return (
        <View style={styles.container}>
            <CategoryRestaurantsModal />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
});
