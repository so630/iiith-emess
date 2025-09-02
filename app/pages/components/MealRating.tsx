import { submit_rating } from "@/app/helpers";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function MealRating({ meal, date, onSubmit }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value: number) => {
    if (submitted) return; // prevent changes after submit
    setSelected(value);
  };

  const handleSubmit = () => {
    if (selected !== null) {
      const body = {
        meal_date: date.toISOString().split("T")[0],
        meal_type: meal.toLowerCase(),
        rating: selected,
        remarks: "",
      };
      submit_rating(body);
      setSubmitted(true); // lock + hide
      if (onSubmit) onSubmit(); // let parent refresh/reload
    }
  };

  // disappear entirely once submitted
  if (submitted) return null;

  return (
    <View style={{ flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Text style={{ fontWeight: "bold" }}>Rate this meal</Text>

      <View style={{ flexDirection: "row", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => handleRate(val)}
            style={{
              padding: 10,
              backgroundColor: selected === val ? "gold" : "lightgray",
              borderRadius: 6,
            }}
          >
            <Text>{val}⭐</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={selected === null}
        style={{
          marginTop: 10,
          padding: 8,
          backgroundColor: selected !== null ? "green" : "gray",
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "white" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
