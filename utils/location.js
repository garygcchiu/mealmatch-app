import * as Location from 'expo-location';

export async function getCurrentLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
}
