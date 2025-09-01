import AsyncStorage from "@react-native-async-storage/async-storage";

// helpers/transformData.ts
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export type MealType = "B" | "L" | "S" | "D";

export interface MealEntry {
  id?: string;
  mess: string;
  category: string;
  availed: boolean;
  cancelled: boolean;
}

export interface DayMeals {
  date: string; // YYYY-MM-DD
  meals: Record<MealType, MealEntry>;
}

export function transformData(apiData: any, start, end): DayMeals[] {
  const mealTypeMap: Record<string, MealType> = {
    breakfast: "B",
    lunch: "L",
    snacks: "S",
    dinner: "D",
  };

  const grouped: Record<string, DayMeals> = {};

  // group API meals by date
  for (const meal of apiData.data) {
    const date = meal.meal_date;
    const type = mealTypeMap[meal.meal_type];

    if (!grouped[date]) {
      grouped[date] = { date, meals: {} as Record<MealType, MealEntry> };
    }

    grouped[date].meals[type] = {
      id: meal.id,
      mess: meal.category === "unregistered" ? "Unregistered" : meal.meal_mess,
      category: meal.category,
      availed: meal.availed_at !== null,
      cancelled: meal.cancelled_at !== null,
    };
  }

  // build full week (Sunday → Saturday)
  const today = dayjs();
  const startOfWeek = dayjs(start); // Sunday
  const endOfWeek = dayjs(end);     // Saturday

  const week: DayMeals[] = [];

  for (
    let d = startOfWeek;
    d.isBefore(endOfWeek) || d.isSame(endOfWeek, "day");
    d = d.add(1, "day")
  ) {
    const dateStr = d.format("YYYY-MM-DD");

    if (grouped[dateStr]) {
      week.push(grouped[dateStr]);
    } else {
      // default with all meals unregistered
      week.push({
        date: dateStr,
        meals: {
          B: { mess: "Unregistered", category: "unregistered", availed: false },
          L: { mess: "Unregistered", category: "unregistered", availed: false },
          S: { mess: "Unregistered", category: "unregistered", availed: false },
          D: { mess: "Unregistered", category: "unregistered", availed: false },
        },
      });
    }
  }

  return week;
}




export const _getAuthKey = async () => {
    try {
        const value = await AsyncStorage.getItem('@AuthKey');
        if (value !== null) {
        // We have data!!
        return value;
        }
    } catch (error) {
        console.log(error)
    }
}

export function formatMess(mess: string) {
    // shorten kadamba-veg → kadamba-v
    const normalized = mess.replace(/^kadamba-(\w).*$/, "kadamba-$1");

    // capitalize each word (so "kadamba-v" → "Kadamba-V", "palash" → "Palash")
    return normalized
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
}

export async function register(body: any)
{
  const auth_key = await _getAuthKey()
  const response = await fetch('https://mess.iiit.ac.in/api/registrations', {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {'Authorization': auth_key, 'Content-Type': 'application/json'}
          });
  console.log(response.status)
  return response.status;
}
