import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { _getAuthKey, DayMeals, formatMess, MealType, transformData } from "@/app/helpers";

const mealTypes: MealType[] = ["B", "L", "S", "D"];

// ---- Component ----
const RegistrationTopBar = ({
  selectedDate,
  setSelectedDate,
  currentRegistration,
  setCurrentRegistration,
  weekData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  weekOffset,
  setWeekOffset,
}) => {
  const flatListRef = useRef<FlatList<DayMeals>>(null);

  // default selection when weekData changes
  useEffect(() => {
    if (!weekData || weekData.length === 0) return;
    const todayStr = dayjs().format("YYYY-MM-DD");
    const hasToday = weekData.some((d) => d.date === todayStr);
    setSelectedDate(hasToday ? todayStr : weekData[0].date);
  }, [weekData]);

  // auto-scroll to selectedDate
  useEffect(() => {
    if (!selectedDate || weekData.length === 0) return;
    const idx = weekData.findIndex((d) => d.date === selectedDate);
    if (idx >= 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      }, 150);
    }
  }, [selectedDate, weekData]);

  // update currentRegistration when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const found = weekData.find((d) => d.date === selectedDate);
    if (found) setCurrentRegistration(found);
  }, [selectedDate, weekData]);

  return (
    <View style={styles.container}>
      {/* Week Nav */}
      <View style={styles.weekNav}>
        <TouchableOpacity
          onPress={() => {
            const newStart = dayjs(startDate)
              .subtract(1, "week")
              .startOf("week")
              .startOf("day");
            const newEnd = newStart.endOf("week").endOf("day");
            setStartDate(newStart.toDate());
            setEndDate(newEnd.toDate());
            setWeekOffset((w) => w - 1);
          }}
          disabled={weekOffset === 0}
        >
          <Text style={[styles.arrow, weekOffset === 0 && styles.disabled]}>
            {"<"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.weekText}>
          {dayjs(startDate).format("MMM D")} - {dayjs(endDate).format("MMM D")}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const newStart = dayjs(startDate)
              .add(1, "week")
              .startOf("week")
              .startOf("day");
            const newEnd = newStart.endOf("week").endOf("day");
            setStartDate(newStart.toDate());
            setEndDate(newEnd.toDate());
            setWeekOffset((w) => w + 1);
          }}
          disabled={weekOffset === 3}
        >
          <Text style={[styles.arrow, weekOffset === 3 && styles.disabled]}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Days */}
      <FlatList
        ref={flatListRef}
        data={weekData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => {
          const isSelected = item.date === selectedDate;

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(item.date);
                setCurrentRegistration(item);
              }}
              activeOpacity={0.75}
            >
              <View
                style={[styles.dayCard, isSelected && styles.todayHighlight]}
              >
                <Text style={styles.dayText}>
                  {dayjs(item.date).format("ddd")}
                </Text>
                <Text style={styles.dateText}>
                  {dayjs(item.date).format("D")}
                </Text>

                {["B", "L", "S", "D"].map((meal) => {
                  const mealEntry = item.meals[meal];
                  return (
                    <View key={meal} style={styles.mealRow}>
                      <Text style={styles.mealBadge}>{meal}</Text>
                      <Text
                        style={[
                          styles.mealText,
                          mealEntry?.availed
                            ? { textDecorationLine: "line-through" }
                            : {},
                          mealEntry?.cancelled
                            ? { color: "red" }
                            : {}
                        ]}
                      >
                        {mealEntry?.mess && mealEntry.cancelled === false
                          ? formatMess(mealEntry.mess)
                          : mealEntry?.cancelled === true ? "Cancelled" : "Unregistered"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
  },
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  weekText: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  disabled: {
    color: "#ccc",
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 6,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: 140,
    alignItems: "flex-start",
  },
  todayHighlight: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  mealBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D9D9D9",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    marginRight: 6,
    fontSize: 12,
    fontWeight: "800",
  },
  mealText: {
    fontSize: 12,
    color: "#333",
  },
});

export default RegistrationTopBar;
