import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import Categories from '../data/categories';
import { View } from '../components/Themed';
import GlobalContext from '../utils/context';
import CategoryList from '../components/CategoryList';

export default function AppetiteScreen() {
    const { userAppetite, clearUserAppetite } = useContext(GlobalContext);
    const [displayAppetite, setDisplayAppetite] = useState([]);

    useEffect(() => {
        setDisplayAppetite([
            {
                title: "What You're Feeling",
                data: Categories.filter((item) =>
                    userAppetite.includes(item.id)
                ),
            },
        ]);
    }, [userAppetite]);

    const createConfirmationAlert = () => {
        Alert.alert(
            'Confirmation',
            'This will clear all categories from your appetite list. Are you sure?',
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => clearUserAppetite() },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <CategoryList
                categories={displayAppetite}
                showClearAllButton
                onClearAllButtonPress={() => createConfirmationAlert()}
            />
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
});
