import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

const CompareAppetiteButton = ({ handleOnPress, isLoading }) => {
    return (
        <Button
            type="solid"
            title={'Compare Appetite!'}
            buttonStyle={styles.compareButton}
            iconRight={true}
            icon={
                <Icon
                    type={'ionicon'}
                    name={'ios-rocket'}
                    color={'white'}
                    containerStyle={styles.rocketIcon}
                />
            }
            onPress={handleOnPress}
            loading={isLoading}
        />
    );
};

const styles = StyleSheet.create({
    compareButton: {
        borderRadius: 12,
        height: 50,
        width: 220,
    },
    rocketIcon: {
        marginLeft: 10,
    },
});

export default CompareAppetiteButton;
