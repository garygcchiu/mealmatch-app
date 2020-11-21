import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';

const AppetiteToggleButton = ({ isInAppetite, onButtonPress, isLoading }) => {
    return isLoading ? (
        <ActivityIndicator style={styles.loadingIcon} size={'large'} />
    ) : (
        <Icon
            type={'ionicon'}
            name={isInAppetite ? 'md-checkmark-circle' : 'ios-add-circle'}
            color={isInAppetite ? 'green' : 'black'}
            size={45}
            iconStyle={styles.icon}
            containerStyle={styles.iconContainer}
            onPress={onButtonPress}
        />
    );
};

const styles = StyleSheet.create({
    icon: {
        overflow: 'hidden',
        marginTop: -5,
        marginBottom: -5,
    },
    iconContainer: {
        backgroundColor: 'white',
        borderRadius: 50,
        marginRight: 10,
    },
    loadingIcon: {
        // backgroundColor: 'white',
        borderRadius: 50,
        marginRight: 10,
    },
});

export default AppetiteToggleButton;
