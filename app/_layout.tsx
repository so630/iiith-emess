import { Stack } from "expo-router";
import Header from "./pages/Header";

export default function RootLayout() {
  return <Stack screenOptions={{header: () => <Header />}} />;
}
