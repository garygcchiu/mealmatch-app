import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import Categories from '../data/categories';
import { View } from '../components/Themed';
import GlobalContext from '../utils/context';
import CategoryList from '../components/CategoryList';
import OverlayModal from '../components/OverlayModal';

export default function AppetiteScreen() {
    const { userAppetite, clearUserAppetite } = useContext(GlobalContext);
    const [displayAppetite, setDisplayAppetite] = useState([]);
    const [showClearOverlay, setShowClearOverlay] = useState(false);

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

    return (
        <View style={styles.container}>
            <CategoryList
                categories={displayAppetite}
                showClearAllButton
                onClearAllButtonPress={() => setShowClearOverlay(true)}
            />
            <OverlayModal
                title={'Confirmation'}
                onBackdropPress={() => setShowClearOverlay(false)}
                onCancelPress={() => setShowClearOverlay(false)}
                onConfirmPress={() => {
                    clearUserAppetite();
                    setShowClearOverlay(false);
                }}
                description={
                    'This will clear all categories from your appetite list. Are you sure?'
                }
                showOverlay={showClearOverlay}
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
