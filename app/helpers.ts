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

export async function cancel(body: any)
{
  const auth_key = await _getAuthKey();
  const response = await fetch('https://mess.iiit.ac.in/api/registrations/cancel', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Authorization': auth_key, 'Content-Type': 'application/json'}
  })
  console.log(response.status);
  return response.status;
}

export async function uncancel(body: any)
{
  const auth_key = await _getAuthKey();
  const response = await fetch('https://mess.iiit.ac.in/api/registrations/uncancel', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Authorization': auth_key, 'Content-Type': 'application/json'}
  })
  console.log(response.status);
  return response.status;
}

export async function feedback_window_time(
  date: Date,
  meal: string,
  mess: string
): Promise<boolean> {
  const mealKey = meal.toLowerCase();
  const messKey = mess.toLowerCase();

  console.log("[feedback_window_time] INPUT:", {
    date: date.toISOString(),
    meal: mealKey,
    mess: messKey,
  });

  const authKey = await _getAuthKey();

  const [timingsRes, feedbackRes] = await Promise.all([
    fetch("https://mess.iiit.ac.in/api/config/meal-timings", {headers: {'Authorization': authKey}}),
    fetch("https://mess.iiit.ac.in/api/config/feedback-window", {headers: {'Authorization': authKey}}),
  ]);

  const timingsBody = await timingsRes.json();
  const feedbackBody = await feedbackRes.json();

  console.log("[feedback_window_time] feedbackBody RAW =", feedbackBody);

  console.log("[feedback_window_time] API responses:", {
    timingsKeys: timingsBody,
    feedbackConfig: feedbackBody,
  });

  const rating_window_minutes = feedbackBody?.data ?? 30;
  console.log("[feedback_window_time] rating_window_minutes =", rating_window_minutes);

  const timings = timingsBody.data[messKey];
  if (!timings) {
    console.warn(`[feedback_window_time] No timings found for mess: ${messKey}`);
    return false;
  }

  const timing = timings.find((t: any) => t.meal.toLowerCase() === mealKey);
  if (!timing) {
    console.warn(`[feedback_window_time] No timing found for meal: ${mealKey} in ${messKey}`);
    return false;
  }

  const now = new Date();
  console.log("[feedback_window_time] now =", now.toISOString());

  const [endH, endM, endS] = timing.end_time.split(":").map((x: string) => parseInt(x, 10));
  const endDateTime = new Date(date);
  endDateTime.setHours(endH, endM, endS, 0);

  console.log("[feedback_window_time] endDateTime =", endDateTime.toISOString());

  const windowClose = new Date(endDateTime.getTime() + rating_window_minutes * 60 * 1000);
  console.log("[feedback_window_time] windowClose =", windowClose.toISOString());

  const withinWindow = now >= endDateTime && now <= windowClose;
  console.log("[feedback_window_time] RESULT =", withinWindow);

  return withinWindow;
}



export async function submit_rating(body: any) {
  const authKey = await _getAuthKey();

  const response = await fetch('https://mess.iiit.ac.in/api/registrations/feedback', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Authorization': authKey, 'Content-Type': 'application/json' }
  });

  // Extract meal + date from body
  console.log(body)
  const { meal_date, meal_type } = body;
  if (!meal_date || !meal_type) {
    console.warn("[submit_rating] Missing date/meal in body, skipping storage");
    return response.status;
  }

  // If successfully rated OR already rated (409), store in AsyncStorage
  if (response.ok || response.status === 409) {
    try {
      const key = `@Rated:${meal_date}:${meal_type[0].toUpperCase()}`;
      await AsyncStorage.setItem(key, "true");
      console.log(`[submit_rating] Stored rated flag in AsyncStorage: ${key}`);
    } catch (err) {
      console.error("[submit_rating] Failed to store rating flag:", err);
    }
  }

  return response.status;
}



