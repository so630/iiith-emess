import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SlidingTabs from "./SlidingTabsForMenu";

export default function BreakfastCard({date, currentRegistration, setCurrentRegistration}) {
    const messes = ['Palash', 'Yuktahar', 'Kadamba-Veg', 'Kadamba-Nonveg'];
    const messkey = {'palash': 0, 'yuktahar': 1, 'kadamba-veg': 2, 'kadamba-nonveg': 3}
    const [mess,
        setMess] = useState(0); // 0 for Palash, 1 for Yuktahar, 2 for Kadamba

    const [data, setData] = useState<any[] | undefined>(undefined);
    const handleUpdate = (newMess : number) => {
        setMess(newMess);
        console.log("Selected mess:", newMess);
        console.log(data);
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

    useEffect(() => console.log(data), [data]);

    const [containerWidth, setContainerWidth] = useState(0);

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

    React.useEffect(() => {
        if (Object.keys(currentRegistration).length !== 0) {
            console.log('meal changed');
            console.log(currentRegistration.meals);

            const mealReg = currentRegistration.meals?.[meal[0]]; // safe access
            if (mealReg && mealReg.mess) {
                const mess_name: string = mealReg.mess;
                setMess(messkey[mess_name]);
            } else {
                console.log(`${meal} not registered`);
                // fallback if user not registered
                setMess(0); // default to Palash, or whichever you prefer
            }
        }
    }, [meal])

    React.useEffect(() => {
        console.log('getting menu!')
        const getMenu = async() => {
            const result = await fetch(`https://mess.iiit.ac.in/api/mess/menus?on=${date.toISOString().split("T")[0]}`);
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
    }, [date]);
  return (
    <View style={styles.card} onLayout={event => {
        setContainerWidth(event.nativeEvent.layout.width);
    }}>
      {/* Header */}
        <TouchableOpacity onPress={() => setMealModalVisible(true)}>
            <Text
                style={styles.title}>
                {meal}
            </Text>
        </TouchableOpacity>

        {/* Date picker */}
        <Text
                style={styles.date}>
                {date.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                })}
        </Text>

        <ScrollView
            style={{ maxHeight: 120, marginBottom: 20, marginLeft: 16 }}
            contentContainerStyle={{ paddingRight: 16 }}
            showsVerticalScrollIndicator={true}
        >
            {menu && menu[days[date.getDay()]][meal.toLowerCase()].map((item : {
                category: string,
                item: string
            }, index : number) => item.item !== '' && 
            <Text key={index}>
                <Text
                    style={{
                    color: "#D0D0D0"
                }}>{item.category}</Text>: {item.item}
                </Text>)
            }
        </ScrollView>

      {/* Options (Palash, Yuktahar, Kadamba) */}
        {containerWidth > 0 && (
            <SlidingTabs
            onUpdate={handleUpdate}
            containerWidth={containerWidth}
            mess={mess}
            />
        )}

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

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  items: {
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    color: "#777",
    marginBottom: 6,
  },
  options: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
  },
  active: {
    backgroundColor: "#4A90E2",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  activeText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
