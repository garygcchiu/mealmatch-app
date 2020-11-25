import React, { useState, useLayoutEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { Button, Icon, Input } from 'react-native-elements';

import { View, Text } from '../components/Themed';
import * as userApi from '../api/user';
import GlobalContext from '../utils/context';

const ChooseUsernameScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const { setSkipChooseUsername } = useContext(GlobalContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            // headerLeft: () => (
            //     <Icon
            //         name={'ios-arrow-back'}
            //         type={'ionicon'}
            //         style={styles.headerBackArrow}
            //         onPress={() => navigation.navigate('NotFound')}
            //     />
            // ),
            headerShown: true,
            headerTitle: 'Registration',
        });
    }, [navigation]);

    const handleUpdateUsername = async () => {
        // input validation
        if (!username) {
            setUsernameError('Username cannot be empty!');
            return;
        }
        if (username.length < 4) {
            setUsernameError('Username must be greater than 4 characters.');
            return;
        }

        // check dynamoDB if username exists
        let editRes;
        try {
            editRes = await userApi.submitUsername(username);
            console.log('success? edit res = ', editRes);

            if (editRes.success) {
                // success: username valid, create in Cognito
                const user = await Auth.currentAuthenticatedUser();
                const updateUsernameRes = await Auth.updateUserAttributes(
                    user,
                    {
                        'custom:display_username': username,
                    }
                );

                // refresh cache
                await Auth.currentAuthenticatedUser({ bypassCache: true });

                if (updateUsernameRes === 'SUCCESS') {
                    setSkipChooseUsername();
                }
            }
        } catch (err) {
            if (err.response.data.error === 'USERNAME_EXISTS') {
                setUsernameError(
                    'Username already taken, please choose a different username'
                );
            } else {
                setUsernameError(
                    'Error choosing username, please try again in a bit'
                );
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose a Username</Text>
            <Text style={styles.description}>
                This is how others will search for you and follow you!
            </Text>
            <Input
                autoCapitalize={'none'}
                placeholder={'Username'}
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
                leftIcon={<Icon type={'ionicon'} name={'ios-at'} />}
                containerStyle={styles.inputContainer}
                errorMessage={usernameError}
            />
            <Button
                title={'Submit'}
                buttonStyle={styles.submitButton}
                onPress={handleUpdateUsername}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '50%',
    },
    headerBackArrow: {
        marginLeft: 12,
    },
    title: {
        fontSize: 20,
        marginVertical: 8,
    },
    description: {
        fontSize: 14,
        marginVertical: 4,
        paddingHorizontal: 10,
    },
    inputContainer: {
        width: '60%',
    },
    submitButton: {
        borderRadius: 16,
        height: 50,
        width: 100,
        marginTop: 14,
    },
});

export default ChooseUsernameScreen;
