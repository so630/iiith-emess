import React, { useState } from "react";
import {
View,
Text,
TextInput,
Pressable,
StyleSheet,
Modal,
} from "react-native";

import * as ImagePicker from 'expo-image-picker'

type LoginModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function LoginModal({modalVisible, setModalVisible}: LoginModalProps) {

    const [selectedImage, setSelectedImage] = useState('');

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
            setSelectedImage(result.assets[0].uri);
            console.log(result.assets[0].uri);
        }
    };

return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={!modalVisible}
    onRequestClose={() => setModalVisible(false)}
    >
    <View style={styles.overlay}>
        <View style={styles.modalContainer}>
        {/* Title */}
        <Text style={styles.title}>Login</Text>

        {/* Upload QR Button */}
        <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={handleImageUpload}>Upload QR</Text>
        </Pressable>

        {/* OR separator */}
        <Text style={styles.orText}>OR</Text>

        {/* Token Input */}
        <TextInput
            style={styles.input}
            placeholder="Enter your token..."
            placeholderTextColor="#2c5282"
        />
        {/* Upload QR Button */}
        <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={() => console.log("login using token")}>Login </Text>
        </Pressable>
        </View>
        
    </View>
    </Modal>
);
}

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // dim background
},
modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Android shadow
    width: '100%',
    height: '70%'
},
title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#1a365d",
},
button: {
    backgroundColor: "#5A90C8",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
orText: {
    color: "#5A90C8",
    fontWeight: "600",
    marginVertical: 16,
    fontSize: 16,
},
input: {
    borderWidth: 1,
    borderColor: "#5A90C8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    fontSize: 16,
    color: "#1a365d",
    backgroundColor: "#f7f7f7",
    marginBottom: 20
},
});

