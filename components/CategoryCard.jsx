import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Text, View } from './Themed';
import React from 'react';

const cardLength = Dimensions.get('window').width / 2 - 26;

const splitter = (str, l) => {
    const strs = [];
    while (str.length > l) {
        let pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        let i = str.indexOf(' ', pos) + 1;
        if (i < pos || i > pos + l) i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs.join('\n');
};

const getItemTitle = (title) => {
    return splitter(title, 15);
};

export default function CategoryCard({ title, image }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5}>
                <ImageBackground source={image} style={styles.imageBackground}>
                    <Text style={styles.text}>{getItemTitle(title)}</Text>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width / 2 - 8,
        marginTop: 15,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: cardLength,
        width: cardLength,
        alignSelf: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
});
