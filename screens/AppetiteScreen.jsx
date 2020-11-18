import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import Categories from '../data/categories';
import { Text, View } from '../components/Themed';
import GlobalContext from '../utils/context';
import CategoryList from '../components/CategoryList';

export default function AppetiteScreen() {
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
    } = useContext(GlobalContext);
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
    }, []);

    return (
        <View style={styles.container}>
            <CategoryList categories={displayAppetite} />
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
