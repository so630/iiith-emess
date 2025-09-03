import { EventEmitter } from "fbemitter";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storageEmitter = new EventEmitter();

export const setAuthKey = async (key: string) => {
  await AsyncStorage.setItem("@AuthKey", key);
  storageEmitter.emit("authKeyChanged", key);
};

export const clearAuthKey = async () => {
  await AsyncStorage.removeItem("@AuthKey");
  storageEmitter.emit("authKeyChanged", null);
};

export const listenAuthKey = (callback: (key: string | null) => void) => {
  const sub = storageEmitter.addListener("authKeyChanged", callback);
  return () => sub.remove(); // unsubscribe when no longer needed
};

export const clearEverything = async () => {
  await AsyncStorage.clear();
  storageEmitter.emit("authKeyChanged", null); // fire logout event
};
