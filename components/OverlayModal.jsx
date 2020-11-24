import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Button, Overlay } from 'react-native-elements';

const OverlayModal = ({
    showOverlay,
    title,
    description,
    onConfirmPress,
    onCancelPress,
    onBackdropPress,
    isConfirmButtonLoading,
}) => {
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
                <Text style={styles.overlayDescription}>{description}</Text>
                <View style={styles.overlayButtons}>
                    <Button
                        title={'Yes'}
                        buttonStyle={styles.overlayButton}
                        onPress={() => onConfirmPress()}
                        loading={isConfirmButtonLoading}
                    />
                    <Button
                        title={'No'}
                        type={'outline'}
                        buttonStyle={styles.overlayButton}
                        onPress={() => onCancelPress()}
                    />
                </View>
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    overlay: {
        width: Dimensions.get('window').width - 50,
        height: 240,
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
        marginTop: 28,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-evenly',
    },
    overlayButton: {
        borderRadius: 10,
        width: 100,
        height: 50,
    },
});

export default OverlayModal;
