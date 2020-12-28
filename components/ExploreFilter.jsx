import React from 'react';
import { View, Text } from './Themed';
import { StyleSheet } from 'react-native';
import { ListItem, Badge, Divider } from 'react-native-elements';
import { SwipeablePanel } from 'rn-swipeable-panel';

import { filterOptions } from '../data/filterOptions';

const ExploreFilter = ({
    visible,
    handleClose,
    selectedOption,
    handleOptionPress,
}) => {
    const closeModal = () => {
        setTimeout(() => {
            handleClose();
        }, 200);
    };

    return (
        <SwipeablePanel
            isActive={visible}
            onClose={closeModal}
            fullWidth={true}
            onlySmall={true}
            closeOnTouchOutside={true}
            noBackgroundOpacity={true}
        >
            <View>
                <Text style={styles.sortText}>Sort</Text>
                <Divider style={styles.divider} />
                {filterOptions.map((option) => (
                    <ListItem
                        bottomDivider
                        onPress={() => handleOptionPress(option)}
                        key={option}
                    >
                        <ListItem.Content>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <ListItem.Title>{option}</ListItem.Title>
                                {selectedOption === option && (
                                    <Badge
                                        value={''}
                                        containerStyle={{
                                            marginHorizontal: 10,
                                        }}
                                    />
                                )}
                            </View>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </View>
        </SwipeablePanel>
    );
};

const styles = StyleSheet.create({
    divider: {
        marginTop: 10,
    },
    sortText: {
        fontSize: 22,
        marginLeft: 12,
    },
});

export default ExploreFilter;
