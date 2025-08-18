import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import Tabs from './components/Tabs'
import { useState } from 'react';

export default function Menu()
{
    const [mess, setMess] = useState(0); // 0 for Palash, 1 for Yuktahar, 2 for Kadamba
    const handleUpdate = (newMess: number) => {
        setMess(newMess);
        // console.log("Selected mess:", newMess);
    };

    

    const messes = ['Palash', 'Yuktahar', 'Kadamba'];

    return (
        <View style={{ flex: 1, backgroundColor: "#F6F6F2" }}>
        {/* Header from navigator */}

        {/* Content area */}
        <ScrollView 
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, flexGrow: 1}}
            showsVerticalScrollIndicator={false}
        >
            

            {/* Card */}
            <View style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 16,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
            marginBottom: 20,
            width: '60%',
            marginTop: 30
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Breakfast</Text>
            <Text>Friday, 15th August</Text>
            </View>

            {/* Menu items */}
            <View style={{ marginBottom: 20, marginLeft: 16, height: '60%' }}>
                <Text>category: mandatory</Text>
                <Text>🍲 item2</Text>
                <Text>🥒 pickle/fresh</Text>
                <Text>🍉 fruits</Text>
            </View>

            <Tabs onUpdate={handleUpdate} />
        </ScrollView>

        {/* Bottom bar from navigator */}
        </View>

    )
}