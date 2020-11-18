import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import useColorScheme from '../hooks/useColorScheme';

const ClearAppetiteButton = ({ onButtonPress }) => {
    const colorScheme = useColorScheme();

    return (
        <Button
            icon={
                <Icon
                    type={'material-community'}
                    name="file-document-box-remove-outline"
                    size={22}
                    color={colorScheme === 'light' ? 'black' : 'white'}
                />
            }
            buttonStyle={styles.optionsButton}
            onPress={onButtonPress}
        />
    );
};

const styles = StyleSheet.create({
    optionsButton: {
        backgroundColor: '#f0f0f1',
        borderRadius: 13,
        height: 45,
        width: 40,
        borderColor: '#f0f0f1',
        borderWidth: 1,
        marginLeft: 6,
        marginRight: 6,
    },
});

export default ClearAppetiteButton;
