import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Button, Input, Overlay } from 'react-native-elements';

const OverlayInputModal = ({
    showOverlay,
    title,
    onSubmitPress,
    onBackdropPress,
    inputLabel,
    buttonLoading = false,
}) => {
    const [input, setInput] = useState('');

    return (
        <Overlay
            isVisible={showOverlay}
            onBackdropPress={() => onBackdropPress()}
            overlayStyle={styles.overlay}
        >
            <View style={styles.overlayContainer}>
                <Text style={styles.overlayTitle}>{title}</Text>
                <View
                    style={styles.separator}
                    lightColor="#eee"
                    darkColor="rgba(255,255,255,0.1)"
                />
                <Input
                    label={inputLabel}
                    value={input}
                    onChangeText={setInput}
                    containerStyle={styles.input}
                />
                <View style={styles.overlayButtons}>
                    <Button
                        title={'Submit'}
                        buttonStyle={styles.overlayButton}
                        onPress={() => onSubmitPress(input)}
                        loading={buttonLoading}
                    />
                </View>
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    overlay: {
        width: Dimensions.get('window').width - 50,
        borderRadius: 25,
    },
    separator: {
        marginVertical: 8,
        height: 1,
        width: '80%',
    },
    overlayContainer: {
        alignItems: 'center',
    },
    overlayTitle: {
        paddingTop: 10,
        fontSize: 20,
    },
    overlayDescription: {
        textAlign: 'center',
        fontSize: 16,
        color: '#030303',
        paddingHorizontal: 20,
        marginTop: 16,
    },
    overlayButtons: {
        marginVertical: 10,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-evenly',
    },
    overlayButton: {
        borderRadius: 10,
        width: 100,
        height: 50,
    },
    input: {
        marginTop: 15,
    },
});

export default OverlayInputModal;
