import React, { useContext, useState } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import CategoryCard from './CategoryCard';
import GlobalContext from '../utils/context';
import { Button, Icon } from 'react-native-elements';
import useColorScheme from '../hooks/useColorScheme';
import ClearAppetiteButton from './ClearAppetiteButton';

const CategoryList = ({
    categories,
    showClearAllButton = false,
    onClearAllButtonPress,
    showActionButton = true,
}) => {
    const colorScheme = useColorScheme();
    const {
        userAppetite,
        addToUserAppetite,
        removeFromUserAppetite,
    } = useContext(GlobalContext);
    const [isItemLoading, setIsItemLoading] = useState([]); // [itemId]

    const renderCategory = (item, isInAppetite) => {
        const handleActionButtonPress = async (itemId) => {
            setIsItemLoading([...isItemLoading, itemId]);

            if (isInAppetite) {
                await removeFromUserAppetite(item.id);
            } else {
                await addToUserAppetite(item.id);
            }

            setIsItemLoading([...isItemLoading.filter((i) => i !== itemId)]);
        };

        return (
            <CategoryCard
                title={item.name}
                image={item.image}
                categoryId={item.id}
                isInAppetite={isInAppetite}
                onActionButtonPress={() => handleActionButtonPress(item.id)}
                isLoading={isItemLoading.includes(item.id)}
                showActionButton={showActionButton}
            />
        );
    };

    const renderSectionHeader = (title) => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text
                    style={[
                        styles.sectionHeaderText,
                        {
                            backgroundColor:
                                colorScheme === 'light' ? 'white' : 'black',
                        },
                    ]}
                >
                    {title}
                </Text>
                {showClearAllButton && (
                    <ClearAppetiteButton
                        onButtonPress={onClearAllButtonPress}
                    />
                )}
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
            maxToRenderPerBatch={10}
        />
    );
};

const styles = StyleSheet.create({
    sectionHeaderText: {
        fontSize: 24,
        paddingLeft: 14,
        paddingRight: 14,
        height: 50,
        paddingTop: 16,
        marginBottom: 8,
    },
    sectionHeaderContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#aeaeaf',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 4,
    },
});

export default CategoryList;
