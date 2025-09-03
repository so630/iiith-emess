import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Modal
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage"

type LoginModalProps = {
    modalVisible: boolean;
    setModalVisible: (visible : boolean) => void;
};

export default function LoginModal({modalVisible, setModalVisible} : LoginModalProps) {

    const [authKey,
        setAuthKey] = useState('');

    const handleAuth = async() => {
        const _storeAuthKey = async() => {
            try {
                await AsyncStorage.setItem('@AuthKey', authKey)
            } catch (err) {
                console.log(err);
            }
        };

        const res = await fetch('https://mess.iiit.ac.in/api/auth/keys/info', {
            headers: {
                'Authorization': authKey
            }
        })

        if (res.status != 200) {
            console.log(res.status);
        } else {
            await _storeAuthKey();
            console.log(`${authKey} stored`);
            setModalVisible(true);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={!modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Title */}
                    <Text style={styles.title}>Login</Text>

                    {/* Token Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your token..."
                        placeholderTextColor="#2c5282"
                        onChangeText={(e) => setAuthKey(e)}/>
                    <Pressable style={styles.button} onPress={handleAuth}>
                        <Text style={styles.buttonText} >Login</Text>
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
        color: "#1a365d"
    },
    button: {
        backgroundColor: "#5A90C8",
        paddingVertical: 15,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        marginBottom: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    orText: {
        color: "#5A90C8",
        fontWeight: "600",
        marginVertical: 16,
        fontSize: 16
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
    }
});
