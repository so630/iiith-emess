import { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const mainTabs = ["Palash", "Yuktahar", "Kadamba"];
const screenWidth = Dimensions.get("window").width;


// Colors for each main tab
const tabColors = ["#6b9edb", "#008080", "#FF7F50"];

function SlidingTabs({ onUpdate, containerWidth }: { onUpdate: (arg: number) => void, containerWidth: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [kadambaChoice, setKadambaChoice] = useState<0 | 1>(0); // 0=Veg, 1=Nonveg
  const tabWidth = (containerWidth-128) / 3;

  const animValue = useRef(new Animated.Value(0)).current;

  const handlePress = (index: number) => {
    setActiveIndex(index);

    if (index === 2) {
      // Default Kadamba = Veg (2)
      onUpdate(2);
    } else {
      onUpdate(index);
    }

    Animated.spring(animValue, {
      toValue: index,
      useNativeDriver: false,
    }).start();
  };

  const handleKadambaChoice = (choice: 0 | 1) => {
    setKadambaChoice(choice);
    onUpdate(choice === 0 ? 2 : 3); // Veg=2, Nonveg=3
  };

  const translateX = animValue.interpolate({
    inputRange: mainTabs.map((_, i) => i),
    outputRange: mainTabs.map((_, i) => i * tabWidth),
  });

  const backgroundColor = animValue.interpolate({
    inputRange: mainTabs.map((_, i) => i),
    outputRange: tabColors,
  });

  return (
    <View>
      <View style={styles.container}>
        {/* Sliding background */}
        <Animated.View
          style={[
            styles.slider,
            {
              width: tabWidth,
              transform: [{ translateX }],
              backgroundColor,
            },
          ]}
        />

        {/* Main Tabs */}
        {mainTabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handlePress(index)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === index && styles.activeText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kadamba Veg/Nonveg Toggle */}
      {activeIndex === 2 && (
        <View style={styles.kadambaToggle}>
          <TouchableOpacity
            style={[
              styles.kadambaOption,
              kadambaChoice === 0 && {backgroundColor: '#138808'},
              { padding: 8, alignItems: "center", justifyContent: "center" }
            ]}
            onPress={() => handleKadambaChoice(0)}
          >
            <Text
              style={[
                styles.kadambaText,
                kadambaChoice === 0 && styles.kadambaActiveText,
              ]}
            >
              V
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.kadambaOption,
              kadambaChoice === 1 && styles.kadambaActive,
            ]}
            onPress={() => handleKadambaChoice(1)}
          >
            <Text
              style={[
                styles.kadambaText,
                kadambaChoice === 1 && styles.kadambaActiveText,
              ]}
            >
              NV
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 48,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    paddingVertical: 4,
    // Box shadow for iOS and elevation for Android
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  slider: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    color: "#000",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  kadambaToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 16,
  },
  kadambaOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eee",
  },
  kadambaActive: {
    backgroundColor: "#FF7722",
  },
  kadambaText: {
    fontWeight: "500",
    color: "#333",
  },
  kadambaActiveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SlidingTabs;
