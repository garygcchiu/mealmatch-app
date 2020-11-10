import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { withOAuth } from 'aws-amplify-react-native';
import { Auth } from 'aws-amplify';

import { Text, View } from '../components/Themed';
import {
    SocialIcon,
    Card,
    ButtonGroup,
    Input,
    Icon,
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
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [showSendVerificationAgain, setShowSendVerificationAgain] = useState(
        false
    );
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verificationError, setVerificationError] = useState('');

    const { googleSignIn, facebookSignIn } = props;

    const handleSignUp = async (email, password) => {
        setUsernameError('');
        setPasswordError('');
        setShowSendVerificationAgain(false);

        try {
            await Auth.signUp({
                email,
                password,
                username: email,
            });
            setShowVerification(true);
            delaySendVerificationAgain();
        } catch (err) {
            console.log('error signing up:', err);
            if (err.message.toLowerCase().includes('username')) {
                setUsernameError(err.message.split(':').pop().trim());
            } else if (err.message.toLowerCase().includes('password')) {
                setPasswordError(err.message.split(':').pop().trim());
            } else {
                setPasswordError('Unexpected error, please try again later.');
            }
        }
    };

    const delaySendVerificationAgain = () => {
        setTimeout(() => {
            setShowSendVerificationAgain(true);
        }, 10000);
    };

    const handleSignIn = async (email, password) => {
        try {
            await Auth.signIn(email, password);
        } catch (err) {
            if (err.message.toLowerCase().includes('user')) {
                setUsernameError(err.message);
            } else if (err.message.toLowerCase().includes('password')) {
                setPasswordError(err.message.split(':').pop().trim());
            } else {
                setPasswordError('Unexpected error, please try again later.');
            }
        }
    };

    const handleVerificationCodeSubmit = async () => {
        try {
            const confirmation = await Auth.confirmSignUp(
                email,
                verificationCode
            );
            if (confirmation === 'SUCCESS') {
                await handleSignIn(email, password);
            }
        } catch (err) {
            setVerificationError(err.message);
            console.log('error confirming sign up', err);
        }
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
                    placeholder={'Email Address'}
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                    errorMessage={usernameError}
                />
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
                            placeholder={'Verification Code'}
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
                            ? handleSignIn(email, password)
                            : handleSignUp(email, password)
                    }
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
