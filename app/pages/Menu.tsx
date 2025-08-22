import {View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native'
import Tabs from './components/Tabs'
import {useState} from 'react';
import React from 'react';

import {Picker} from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Menu() {
    const messes = ['Palash', 'Yuktahar', 'Kadamba-Veg', 'Kadamba-Nonveg'];
    const [mess,
        setMess] = useState(0); // 0 for Palash, 1 for Yuktahar, 2 for Kadamba

    const [data, setData] = useState<any[] | undefined>(undefined);
    const handleUpdate = (newMess : number) => {
        setMess(newMess);
        console.log("Selected mess:", newMess);
        if (data)
        {
            data?.map((menu1 : any) => {
                if (menu1.mess === messes[newMess].toLowerCase()) {
                    setMenu(menu1.days);
                    console.log(menu1.days);
                }
            });
        }
    };

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    type MenuType = {
        [day : string]: {
            [meal : string]: {
                category: string;
                item: string
            }[];
        };
    };
    const [menu,
        setMenu] = useState < MenuType | undefined > (undefined);

    const [meal,
        setMeal] = useState("Breakfast");
    const [date,
        setDate] = useState(new Date());
    const [isDatePickerVisible,
        setDatePickerVisibility] = useState(false);
    const [isMealModalVisible,
        setMealModalVisible] = useState(false);

    // smart defaults for meal
    React.useEffect(() => {
        const now = new Date();
        const h = now.getHours(),
            m = now.getMinutes();
        const before = (H : number, M : number) => h < H || (h === H && m <= M);

        if (before(9, 30)) 
            setMeal("Breakfast");
        else if (before(14, 30)) 
            setMeal("Lunch");
        else if (before(21, 30)) 
            setMeal("Dinner");
        else 
            setMeal("Dinner");
        }
    , []);

    const handleConfirm = (selectedDate : any) => {
        setDate(selectedDate);
        setDatePickerVisibility(false);
    };

    React.useEffect(() => {
        const getMenu = async() => {
            const result = await fetch('https://mess.iiit.ac.in/api/mess/menus');
            let body = await result.json();
            body.data.map((menu1 : any) => {
                    if (menu1.mess === messes[mess].toLowerCase()) {
                        setMenu(menu1.days);
                        console.log(menu1.days);
                    }
                });

            setData(body.data);

        }

        getMenu();
        console.log(menu);
    }, []);

    React.useEffect(() => {
        console.log(menu && menu[days[date.getDay()]][meal.toLowerCase()]);
    }, [menu])

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: "#F6F6F2"
        }}>
            <ScrollView
                contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 16,
                flexGrow: 1
            }}
                showsVerticalScrollIndicator={false}>
                {/* Card */}
                <View
                    style={{
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
                    width: "60%",
                    marginTop: 30
                }}>
                    {/* "Meal dropdown" but styled like plain text */}
                    <TouchableOpacity onPress={() => setMealModalVisible(true)}>
                        <Text
                            style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>
                            {meal}
                        </Text>
                    </TouchableOpacity>

                    {/* Date picker */}
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                        <Text
                            style={{
                            color: "#555",
                            marginTop: 8
                        }}>
                            {date.toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long"
                            })}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={date} minimumDate={new Date()} // optional: disable past
                        onConfirm={handleConfirm} onCancel={() => setDatePickerVisibility(false)}/>
                </View>

                {/* Meal selection modal */}
                <Modal
                    visible={isMealModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMealModalVisible(false)}>
                    <TouchableOpacity
                        style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                        onPressOut={() => setMealModalVisible(false)}>
                        <View
                            style={{
                            backgroundColor: "white",
                            borderRadius: 12,
                            padding: 20,
                            width: "70%",
                            elevation: 5
                        }}>
                            {["Breakfast", "Lunch", "Snacks", "Dinner"].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                    setMeal(option);
                                    setMealModalVisible(false);
                                }}
                                    style={{
                                    paddingVertical: 10
                                }}>
                                    <Text
                                        style={{
                                        fontSize: 16,
                                        color: option === meal
                                            ? "#000"
                                            : "#666",
                                        fontWeight: option === meal
                                            ? "bold"
                                            : "normal"
                                    }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Menu items */}
                <View
                    style={{
                    marginBottom: 20,
                    marginLeft: 16,
                    height: "60%"
                }}>

                    {menu && menu[days[date.getDay()]][meal.toLowerCase()].map((item : {
                        category: string,
                        item: string
                    }, index : number) => <Text key={index}>
                        <Text
                            style={{
                            color: "#D0D0D0"
                        }}>{item.category}</Text>: {item.item}</Text>)
}
                </View>

                {/* Tabs */}
                <SlidingTabs onUpdate={handleUpdate} />
            </ScrollView>
        </View>

    )
}



import { useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import SlidingTabs from './components/Tabs';


