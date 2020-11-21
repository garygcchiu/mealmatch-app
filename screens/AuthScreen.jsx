import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';

import { Text, View } from '../components/Themed';
import {
    SocialIcon,
    Card,
    ButtonGroup,
    Input,
    Button,
} from 'react-native-elements';

const AUTH_MODE = {
    LOGIN: 0,
    SIGN_UP: 1,
};

const buttons = ['Login', 'Register'];

function AuthScreen(props) {
    const [mode, setMode] = useState(AUTH_MODE.LOGIN);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [showSendVerificationAgain, setShowSendVerificationAgain] = useState(
        false
    );
    const [loginLoading, setLoginLoading] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const componentIsMounted = useRef(true);

    const { googleSignIn, facebookSignIn } = props;

    useEffect(() => {
        // keep track of component's mounted state: used so delaySendVerificationAgain doesn't update state if unmounted
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    const clearErrors = () => {
        setUsernameError('');
        setFirstnameError('');
        setLastnameError('');
        setEmailError('');
        setPasswordError('');
        setShowSendVerificationAgain(false);
        setVerificationError('');
        setVerificationCode('');
    };

    const handleSignUp = async () => {
        clearErrors();

        if (!username) {
            setUsernameError(
                'Username cannot be empty! It is how you search for friends in the app.'
            );
            return;
        }
        if (username.length < 4) {
            setUsernameError('Username must be more than 4 characters long.');
            return;
        }
        if (!firstname) {
            setFirstnameError('Firstname cannot be empty!');
            return;
        }
        if (!lastname) {
            setLastnameError('Lastname cannot be empty!');
            return;
        }
        if (!email) {
            setEmailError(
                'Email cannot be empty! It is how you recover your account if you forget your password.'
            );
            return;
        }
        if (!password) {
            setPasswordError('Password cannot be empty!');
            return;
        }

        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    given_name: firstname,
                    family_name: lastname,
                    'custom:display_username': username,
                },
            });
            setShowVerification(true);
            delaySendVerificationAgain();
        } catch (err) {
            console.log('error signing up:', err);
            const outputErrorMessage = err.message.split(':').pop().trim();

            if (err.code === 'UsernameExistsException') {
                setUsernameError(err.message);
            } else if (err.message.toLowerCase().includes('username')) {
                setUsernameError(outputErrorMessage);
            } else if (err.message.toLowerCase().includes('password')) {
                setPasswordError(outputErrorMessage);
            } else if (err.message.toLowerCase().includes('given_name')) {
                setFirstnameError(outputErrorMessage);
            } else if (err.message.toLowerCase().includes('family_name')) {
                setLastnameError(outputErrorMessage);
            } else {
                setPasswordError('Unexpected error, please try again later.');
            }
        }
    };

    const delaySendVerificationAgain = () => {
        setTimeout(() => {
            if (componentIsMounted.current) {
                setShowSendVerificationAgain(true);
            }
        }, 15000);
    };

    const handleSignIn = async (animateLoading = true) => {
        if (animateLoading) {
            setLoginLoading(true);
        }

        try {
            await Auth.signIn(username, password);
        } catch (err) {
            if (err.message.toLowerCase().includes('user')) {
                setUsernameError(err.message);
            } else if (err.message.toLowerCase().includes('password')) {
                setPasswordError(err.message.split(':').pop().trim());
            } else {
                setPasswordError('Unexpected error, please try again later.');
            }
        }
        setLoginLoading(false);
    };

    const handleVerificationCodeSubmit = async () => {
        setVerificationLoading(true);
        try {
            const confirmation = await Auth.confirmSignUp(
                username,
                verificationCode
            );
            if (confirmation === 'SUCCESS') {
                await handleSignIn(username, password);
            }
        } catch (err) {
            setVerificationError(err.message);
            console.log('error confirming sign up', err);
        }
        setVerificationLoading(false);
    };

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                <ButtonGroup
                    onPress={(e) => setMode(e)}
                    selectedIndex={mode}
                    buttons={buttons}
                    selectedTextStyle={styles.selectedButtonTextStyle}
                    selectedButtonStyle={styles.modeSelectedButton}
                    containerStyle={styles.buttonGroupContainer}
                    textStyle={styles.buttonTextStyle}
                    innerBorderStyle={styles.buttonGroupInnerBorder}
                />
                <Input
                    placeholder={'Username'}
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                    errorMessage={usernameError}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                />
                {mode === AUTH_MODE.SIGN_UP && (
                    <>
                        <Input
                            placeholder={'First Name'}
                            value={firstname}
                            onChangeText={(value) => setFirstname(value)}
                            errorMessage={firstnameError}
                            autoCapitalize={'words'}
                            autoCorrect={false}
                        />
                        <Input
                            placeholder={'Last Name'}
                            value={lastname}
                            onChangeText={(value) => setLastname(value)}
                            errorMessage={lastnameError}
                            autoCapitalize={'words'}
                            autoCorrect={false}
                        />
                        <Input
                            placeholder={'Email Address'}
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            errorMessage={emailError}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType={'email-address'}
                        />
                    </>
                )}
                <Input
                    placeholder={'Password'}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    errorMessage={passwordError}
                />
                {showVerification && (
                    <View>
                        <Input
                            placeholder={'Email Verification Code'}
                            value={verificationCode}
                            onChangeText={(value) => setVerificationCode(value)}
                            errorMessage={
                                verificationError
                                    ? verificationError
                                    : showSendVerificationAgain
                                    ? "Didn't receive a code? Tap here to send again..."
                                    : ''
                            }
                            errorProps={{
                                style: styles.registrationError,
                                onPress: () => console.log('pressed!!'),
                            }}
                        />
                        <Button
                            title={'Submit Verification'}
                            onPress={handleVerificationCodeSubmit}
                            buttonStyle={styles.verificationButton}
                            loading={verificationLoading}
                        />
                    </View>
                )}
                <Button
                    title={mode === AUTH_MODE.LOGIN ? 'Login' : 'Sign Up'}
                    type={'solid'}
                    containerStyle={styles.loginButtonContainer}
                    buttonStyle={styles.loginButton}
                    titleStyle={styles.loginButtonText}
                    onPress={() =>
                        mode === AUTH_MODE.LOGIN
                            ? handleSignIn()
                            : handleSignUp()
                    }
                    loading={loginLoading}
                />
                <SocialIcon
                    type={'google'}
                    title={'Continue with Google'}
                    button
                    onPress={googleSignIn}
                />
                <SocialIcon
                    type={'facebook'}
                    title={'Continue with Facebook'}
                    button
                    onPress={facebookSignIn}
                />
                <Text style={styles.footer}>
                    By continuing, you agree to MealMatch.io's Terms of Use and
                    confirm that you have read MealMatch.io's Privacy Policy
                </Text>
            </Card>
        </View>
    );
}

export default withOAuth(AuthScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonGroupContainer: {
        borderWidth: 0,
        marginBottom: 24,
    },
    buttonGroupInnerBorder: {
        width: 0,
    },
    buttonTextStyle: {
        fontSize: 16,
    },
    selectedButtonTextStyle: {
        color: 'blue',
    },
    modeSelectedButton: {
        backgroundColor: 0,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        paddingLeft: 10,
        paddingRight: 10,
    },
    card: {
        width: '85%',
        borderRadius: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginButtonContainer: {
        borderRadius: 50,
        marginLeft: 7,
        marginRight: 7,
        marginBottom: 8,
    },
    loginButton: {
        height: 52,
    },
    loginButtonText: {
        fontWeight: '500',
        fontSize: 16,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    footer: {
        color: '#939393',
        fontSize: 11,
        marginTop: 12,
        marginLeft: 14,
        marginRight: 14,
    },
    registrationError: {
        height: 500,
    },
    verificationButton: {
        borderRadius: 50,
        height: 45,
        width: '70%',
        alignSelf: 'center',
        marginLeft: 7,
        marginRight: 7,
        marginBottom: 18,
    },
});
