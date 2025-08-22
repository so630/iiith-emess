import * as ImagePicker from 'expo-image-picker'

const handleImageUpload = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need gallery permissions to make this work!');
        return;
    }

    // Open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }
};