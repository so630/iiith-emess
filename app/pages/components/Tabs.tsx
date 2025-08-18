import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from "react-native";

const tabs = ["Palash", "Yuktahar", "Kadamba"];
const screenWidth = Dimensions.get("window").width;

// Colors for each tab
const tabColors = ["#6b9edb", "#008080", "#FF7F50"];

export default function SlidingTabs(onUpdate: {onUpdate: (arg: number) => void}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = (screenWidth - 96) / tabs.length; // 96 = marginHorizontal*2 (48 each side)

  const animValue = useRef(new Animated.Value(0)).current;

  const handlePress = (index) => {
    setActiveIndex(index);
    onUpdate.onUpdate(index);
    Animated.spring(animValue, {
      toValue: index,
      useNativeDriver: false, // must be false for color interpolation
    }).start();
  };

  // Interpolate slider position
  const translateX = animValue.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => i * tabWidth),
  });

  // Interpolate background color
  const backgroundColor = animValue.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabColors,
  });

  return (
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

      {/* Tabs */}
      {tabs.map((tab, index) => (
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
    paddingTop: 4,
    paddingBottom: 4,
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
});
