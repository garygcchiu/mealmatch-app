import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Text, View } from './Themed';
import React, { useContext } from 'react';
import { Icon } from 'react-native-elements';
import AppetiteToggleButton from './AppetiteToggleButton';
import GlobalContext from '../utils/context';

const cardLength = Dimensions.get('window').width - 20;

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

export default function CategoryCard({
    title,
    image,
    categoryId,
    isInAppetite = false,
    onActionButtonPress,
    isLoading,
    showActionButton,
}) {
    const { setSelectedCategoryId } = useContext(GlobalContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setSelectedCategoryId(categoryId)}
            >
                <ImageBackground
                    source={image}
                    style={styles.imageBackgroundContainer}
                    imageStyle={styles.imageBackground}
                >
                    <Text style={styles.text}>{title}</Text>
                    {showActionButton && (
                        <AppetiteToggleButton
                            isInAppetite={isInAppetite}
                            onButtonPress={onActionButtonPress}
                            isLoading={isLoading}
                        />
                    )}
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        marginTop: 12,
    },
    imageBackgroundContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: cardLength,
        alignSelf: 'center',
    },
    imageBackground: {
        borderRadius: 14,
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'left',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 12,
    },
});
