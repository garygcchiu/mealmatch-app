import React from 'react';
import { View, Text } from './Themed';
import { Modal, StyleSheet } from 'react-native';
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
        <Modal visible={visible} animated={false} transparent={true}>
            <SwipeablePanel
                isActive={visible}
                onClose={closeModal}
                fullWidth={true}
                onlySmall={true}
                closeOnTouchOutside={true}
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
        </Modal>
    );
};

const styles = StyleSheet.create({
    outerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    divider: {
        marginTop: 10,
    },
    sortText: {
        fontSize: 22,
        marginLeft: 12,
    },
});

export default ExploreFilter;
