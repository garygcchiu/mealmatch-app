import React, { useContext } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import CategoryCard from './CategoryCard';
import GlobalContext from '../utils/context';

const CategoryList = ({ categories }) => {
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
    } = useContext(GlobalContext);

    const renderCategory = (item, isInAppetite) => {
        return (
            <CategoryCard
                title={item.name}
                image={item.image}
                isInAppetite={isInAppetite}
                onActionButtonPress={() =>
                    isInAppetite
                        ? removeFromUserAppetite(item.id)
                        : addToUserAppetite(item.id)
                }
            />
        );
    };

    const renderSectionHeader = (title) => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
        );
    };

    const isInAppetite = (item) => {
        return userAppetite.filter((a) => a === item.id).length;
    };

    return (
        <SectionList
            renderItem={({ item }) => renderCategory(item, isInAppetite(item))}
            renderSectionHeader={({ section: { title } }) =>
                renderSectionHeader(title)
            }
            keyExtractor={(item) => item.id}
            numColumns={1}
            horizontal={false}
            style={{ width: '100%' }}
            sections={categories}
        />
    );
};

const styles = StyleSheet.create({
    sectionHeaderText: {
        fontSize: 24,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: 'white',
        height: 50,
        paddingTop: 16,
        marginBottom: 8,
    },
    sectionHeaderContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#aeaeaf',
    },
});

export default CategoryList;
