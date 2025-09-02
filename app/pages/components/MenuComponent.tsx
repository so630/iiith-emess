import React, { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import SlidingTabs from "./SlidingTabsForMenu";
import { cancel, feedback_window_time, getRating, register, uncancel } from "@/app/helpers";
import MealRating from "./MealRating";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Star} from 'lucide-react-native'

export default function BreakfastCard({date, currentRegistration, setCurrentRegistration, onRegistrationChanged}) {
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

    const handleRegister = () => {
        console.log('registering...');
        // console.log(currentRegistration);
        // console.log(meal);
        console.log(date);
        // console.log(messes[mess]);

        // const url = 'https://mess.iiit.ac.in/api/registrations';
        const body = {
            meal_date: date.toISOString().split("T")[0],
            meal_type: meal.toLowerCase(),
            meal_mess: messes[mess].toLowerCase(),
            guests: 0
        }

        console.log(body);

        const status = register(body);
        status.then((status: number) => {
            if (status === 403)
            {
                Alert.alert('The registration window has passed, or the mess is full in capacity :P');
            }
            else if (status === 200)
            {
                onRegistrationChanged();
            }
            else
            {
                Alert.alert('error!');
            }
        });
    };

    const handleCancel = () => {
        console.log('cancelling...');
        const body = {
            meal_date: date.toISOString().split("T")[0],
            meal_type: meal.toLowerCase(),
        }

        const status = cancel(body);
        status.then((status: number) => {
            if (status === 204)
            {
                onRegistrationChanged();
            }
            else if (status === 403)
            {
                Alert.alert('rip cancellation window closed xD');
            }
            else
            {
                Alert.alert('error');
            }
        });

    }

    const handleUncancel = () => {
        console.log('uncancelling...');
        const body = {
            meal_date: date.toISOString().split("T")[0],
            meal_type: meal.toLowerCase(),
        }

        const status = uncancel(body);
        status.then((status: number) => {
            if (status === 204)
            {
                onRegistrationChanged();
            }
            else if (status === 403)
            {
                Alert.alert('rip uncancellation window closed xD');
            }
            else
            {
                Alert.alert('error');
            }
        });

    }

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

    // React.useEffect(() => {
    //     if (Object.keys(currentRegistration).length !== 0 && currentRegistration.meals[meal[0]] !== messes[mess] && meal[0] !== 'S')
    //     {
    //         console.log('registering');
    //         console.log(currentRegistration);
    //         console.log(messes[mess]);
    //         console.log(meal[0]);

    //         setCurrentRegistration((prev: any) => {
    //             return {
    //                 ...prev,
    //                 meals: {
    //                     ...prev.meals,
    //                     [meal[0]]: {
    //                         ...prev.meals[meal[0]],
    //                         mess: messes[mess].toLowerCase()
    //                     }
    //                 }
    //             }
    //         })
    //     }
    // }, [mess, meal])

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
            console.log("meal changed");
            console.log(currentRegistration.meals);

            const mealReg = currentRegistration.meals?.[meal[0]]; // safe access
            if (mealReg && mealReg.mess) {
            const mess_name = mealReg.mess.toLowerCase();
            if (mess_name in messkey) {
                setMess(messkey[mess_name]);
            } else {
                console.warn("Unknown mess name:", mess_name);
                setMess(0); // fallback to Palash
            }
            } else {
            console.log(`${meal} not registered`);
            setMess(0); // fallback if user not registered
            }
        } else {
            // 🔥 Handle case where no registration exists at all
            console.log("No registrations for this date/meal");
            setMess(0); // force update so lower component re-renders
        }
    }, [date, meal, currentRegistration]);


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

    const [registeredMess, setRegisteredMess] = useState<string | null>(null);
    const [selectedMess, setSelectedMess] = useState<string | null>(null);

    // Keep selected mess in sync whenever user changes tab
    useEffect(() => {
    setSelectedMess(messes[mess]?.toLowerCase());
    console.log('selected mess');
    console.log(messes[mess]?.toLowerCase());
    }, [mess]);

    // Keep registered mess in sync whenever registration or meal changes
    useEffect(() => {
    if (currentRegistration?.meals?.[meal[0]]?.mess) {
        console.log('registered mess');
        console.log(currentRegistration.meals[meal[0]].mess.toLowerCase());
        setRegisteredMess(currentRegistration.meals[meal[0]].mess.toLowerCase());
    } else {
        setRegisteredMess(null);
    }
    }, [currentRegistration, meal]);


    const [unavailableMesses, setUnavailableMesses] = useState<string[]>([]);

    useEffect(() => {
    if (!data) return;

    const today = days[date.getDay()];
    const unavailable: string[] = [];

    data.forEach((menu1: any) => {
        const messName = menu1.mess; // e.g., "kadamba-nonveg"
        const mealMenu = menu1.days?.[today]?.[meal.toLowerCase()];

        if (messName === "kadamba-nonveg" && mealMenu) {
        // Look for any non-veg item
        const hasNonVeg = mealMenu.some(
            (entry: any) =>
            entry.category.toLowerCase().includes("non-veg") && entry.item.trim() !== ""
        );

        if (!hasNonVeg) {
            unavailable.push(messName); // mark as unavailable
        }
        }
    });

    setUnavailableMesses(unavailable);
    }, [data, date, meal]);

    const [canGiveFeedback, setCanGiveFeedback] = useState(false);

    // check feedback window + AsyncStorage + availed
    useEffect(() => {
    const checkWindowAndStorage = async () => {
        const dateStr = date.toISOString().split("T")[0];
        const mealKey = meal[0]; // B / L / S / D
        const key = `@Rated:${dateStr}:${mealKey}`;

        console.log("[BreakfastCard] === Checking feedback eligibility ===");
        console.log("[BreakfastCard] Inputs:", {
        dateStr,
        meal,
        mealKey,
        mess: messes[mess],
        key,
        });

        try {
        // 1. check if availed
        const availed = currentRegistration?.meals?.[mealKey]?.availed ?? false;
        console.log("[BreakfastCard] availed =", availed);

        if (!availed) {
            console.log("[BreakfastCard] Meal not availed → setCanGiveFeedback(false)");
            setCanGiveFeedback(false);
            return;
        }

        // 2. check feedback window
        const allowed = await feedback_window_time(date, meal, messes[mess]);
        console.log("[BreakfastCard] feedback_window_time result =", allowed);

        if (!allowed) {
            console.log("[BreakfastCard] Outside feedback window → setCanGiveFeedback(false)");
            setCanGiveFeedback(false);
            return;
        }

        // 3. check AsyncStorage if already rated
        const alreadyRated = await AsyncStorage.getItem(key);
        console.log("[BreakfastCard] AsyncStorage.getItem:", {
            key,
            alreadyRated,
        });

        if (alreadyRated) {
            console.log("[BreakfastCard] Meal already rated → setCanGiveFeedback(false)");
            setCanGiveFeedback(false);
        } else {
            console.log("[BreakfastCard] Eligible for feedback → setCanGiveFeedback(true)");
            setCanGiveFeedback(true);
        }
        } catch (err) {
        console.error("[BreakfastCard] Error checking feedback window/storage:", err);
        setCanGiveFeedback(false);
        }

        console.log("[BreakfastCard] Final canGiveFeedback =", canGiveFeedback);
    };

    checkWindowAndStorage();
    }, [date, meal, mess, currentRegistration]);

    const [mealRatingData, setMealRatingData] = useState<any | null>(null);
const requestIdRef = useRef(0);

useEffect(() => {
  const fetchRating = async () => {
    try {
      const dateStr = date.toISOString().split("T")[0];
      const messName = messes[mess].toLowerCase();

      console.log("[BreakfastCard] Fetching rating for:", {
        dateStr,
        messName,
        meal: meal.toLowerCase(),
      });

      const res = await getRating(dateStr, messName, meal.toLowerCase());

      // Handle API response
      if (!res) {
        console.log("[BreakfastCard] getRating → no data (maybe 403 feedback window)");
        setMealRatingData(null);
        return;
      }

      console.log("[BreakfastCard] getRating result:", res);
      setMealRatingData(res);
    } catch (err: any) {
      if (err?.status === 403) {
        console.log("[BreakfastCard] Feedback window still open → skipping rating update");
        return;
      }
      console.error("[BreakfastCard] Error fetching rating:", err);
      setMealRatingData(null);
    }
  };

  fetchRating();
}, [date, meal, mess]);



  return (
    <ScrollView style={styles.card} onLayout={event => {
        setContainerWidth(event.nativeEvent.layout.width);
    }}>
        {mealRatingData ? (
            <View
            style={{
                position: "absolute",
                top: 8,
                right: 8,
                flexDirection: "row",
                alignItems: "center",
            }}
            >
            <Text style={{ fontSize: 12, fontWeight: "600", marginRight: 2 }}>
                {mealRatingData.rating.toFixed(1)}
            </Text>
            <Star size={12} color="gold" fill="gold" />
            </View>
        ) : null}
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
  <>
    <SlidingTabs
      onUpdate={handleUpdate}
      containerWidth={containerWidth}
      mess={mess}
      unavailableMesses={unavailableMesses}
    />

    {/* Register / Cancel Buttons */}
    <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
      {!registeredMess ? (
        // No registration yet → Register
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#81C784",
            padding: 12,
            borderRadius: 8,
          }}

          onPress={handleRegister}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
            Register
          </Text>
        </TouchableOpacity>
      ) : registeredMess === selectedMess ? (
        // Registered mess matches current → Cancel
        currentRegistration.meals[meal[0]]?.cancelled 
            ? (<TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#E57373",
            padding: 12,
            borderRadius: 8,
          }}
          onPress={handleUncancel}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
            Uncancel
          </Text>
        </TouchableOpacity>)
            : 
            (<TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#E57373",
            padding: 12,
            borderRadius: 8,
          }}
          onPress={handleCancel}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
            Cancel
          </Text>
        </TouchableOpacity>)
      ) : (
        // Registered mess different from current → Register
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#81C784",
            padding: 12,
            borderRadius: 8,
          }}

          onPress={handleRegister}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
            Register
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </>
)}

    {canGiveFeedback && (
        <MealRating
            key={`${date.toISOString()}-${meal}-${messes[mess]}`} 
            meal={meal}
            date={date}
            onSubmit={() => {
            console.log("[BreakfastCard] onSubmit from MealRating → hiding MealRating");
            setCanGiveFeedback(false);
            }}
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

    </ScrollView>
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
