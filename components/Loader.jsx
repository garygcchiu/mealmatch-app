import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from './Themed';

export default function Loader({
    loading,
    children,
    noResultsMessage,
    noResults,
    loaderContainerStyle,
}) {
    if (loading) {
        return (
            <ActivityIndicator
                size={'large'}
                style={[{ height: '80%' }, loaderContainerStyle]}
            />
        );
    }

    return noResults ? (
        <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{noResultsMessage}</Text>
        </View>
    ) : (
        { ...children }
    );
}

const styles = StyleSheet.create({
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%',
    },
    noResultsText: {
        color: '#8e8e8f',
        fontSize: 20,
    },
});
