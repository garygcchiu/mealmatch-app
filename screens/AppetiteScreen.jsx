import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import Categories from '../data/categories';
import { Text, View } from '../components/Themed';
import GlobalContext from '../utils/context';

export default function AppetiteScreen() {
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
    } = useContext(GlobalContext);
    const [displayAppetite, setDisplayAppetite] = useState([]);

    useEffect(() => {
        setDisplayAppetite(
            Categories.filter((item) => userAppetite.includes(item.id))
        );
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
            <Text>User Appetite:</Text>
            {displayAppetite.map((a) => (
                <Text key={a.id}>{a.name}</Text>
            ))}
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
