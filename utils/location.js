import * as Location from 'expo-location';

export async function getCurrentLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
        return -1;
    }

    let location = await Location.getCurrentPositionAsync({});
    return `${location.coords.latitude},${location.coords.longitude}`;
}
