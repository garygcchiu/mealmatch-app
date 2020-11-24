import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';

const ListHeader = ({ text, showButtons, buttons }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.header}>{text}</Text>
        {showButtons && buttons}
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#8e8e8f',
        borderBottomWidth: 1,
        height: 42,
        paddingHorizontal: 14,
    },
    header: {
        fontSize: 16,
    },
});

export default ListHeader;
