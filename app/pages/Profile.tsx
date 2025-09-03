import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { _getAuthKey } from "../helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RNRestart from "react-native-restart";
import { clearEverything } from "../storage";

const SettingItem = ({ title, description, value, onChange }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description ? (
          <Text style={styles.settingDescription}>{description}</Text>
        ) : null}
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  </View>
);

export default function SettingsScreen() {
  const [prefs, setPrefs] = useState({
    notify_not_registered: false,
    notify_malloc_happened: false,
    auto_reset_token_daily: false,
    enable_unregistered: false,
    nag_for_feedback: false,
  });

  const [authKey, setAuthKey] = useState("");

  // === Helpers (to be implemented by you) ===
  const fetchPreferences = async () => {
    const authKey = await _getAuthKey();

    try {
        const response = await fetch("https://mess.iiit.ac.in/api/preferences", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: authKey, // or Token <key>, depending on your backend
        },
        });

        if (!response.ok) {
        if (response.status === 401) {
            console.warn("Unauthorized — maybe auth key expired?");
        } else if (response.status === 500) {
            console.error("Server error");
        }
        throw new Error(`Error ${response.status}`);
        }

        const json = await response.json();
        if (json && json.data) {
        setPrefs(json.data); // matches exactly what your API returns
        }
    } catch (err: any) {
        console.error("Failed to fetch preferences:", err.message);
    }
    };

  const updatePreference = async (key, value) => {
    const authKey = await _getAuthKey();
    const newPrefs = {...prefs, [key]: value};
    try {
        const response = await fetch("https://mess.iiit.ac.in/api/preferences", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${authKey}`, // or Token <authKey> depending on backend
        },
        body: JSON.stringify(newPrefs),
        });

        if (response.status === 204) {
        console.log("Preferences updated successfully");
        setPrefs(newPrefs);
        } else if (response.status === 400) {
        console.error("Bad Request – invalid payload");
        } else if (response.status === 401) {
        console.error("Unauthorized – check auth key");
        } else if (response.status === 500) {
        console.error("Server error");
        } else {
        console.error("Unexpected response:", response.status);
        }
    } catch (err) {
        console.error("Failed to update preferences:", err.message);
    }
};


  const updateAuthKey = async () => {
    const _storeAuthKey = async() => {
        try {
            await AsyncStorage.setItem('@AuthKey', authKey)
        } catch (err) {
            console.log(err);
        }
    };

    try {
        const res = await fetch("https://mess.iiit.ac.in/api/auth/keys/info", {
        headers: {
            Authorization: authKey, // keep as-is if backend requires raw key
        },
        });

        if (res.status !== 200) {
            console.log(res.status);
            if (res.status === 401)
            {
                Alert.alert("auth key is incorrect or expired :3");
            }
        } else {
        await _storeAuthKey();
        console.log(`${authKey} stored`);
        Alert.alert("auth key updated UwU");
        }
    } catch (err) {
        console.log("Network error:", err.message);
    } finally {
        // clear input regardless of success/failure
        setAuthKey("");
    }
  };

  const handleLogout = async () => {
    console.log('clearing....')
    // clear storage + navigate
    try {
        await clearEverything();
    } catch (err) {
        console.log("Error clearing storage:", err);
    } finally {
        RNRestart.restart();          // restart the whole JS engine
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <SettingItem
        title="Notify if not registered"
        description="Sends a reminder one day before the registration deadline."
        value={prefs.notify_not_registered}
        onChange={(val) => updatePreference("notify_not_registered", val)}
      />

      <SettingItem
        title="Notify on random allocation"
        description="Sends an email with meals if you've been randomly allocated."
        value={prefs.notify_malloc_happened}
        onChange={(val) => updatePreference("notify_malloc_happened", val)}
      />

      <SettingItem
        title="Auto-reset QR token"
        description="Resets the QR code automatically at 02:00 every day."
        value={prefs.auto_reset_token_daily}
        onChange={(val) => updatePreference("auto_reset_token_daily", val)}
      />

      <SettingItem
        title="Enable unregistered meals"
        description="Allow availing meals on-the-spot at unregistered rates."
        value={prefs.enable_unregistered}
        onChange={(val) => updatePreference("enable_unregistered", val)}
      />

      <SettingItem
        title="Nag for feedback"
        description="Prompts for feedback after every availed meal."
        value={prefs.nag_for_feedback}
        onChange={(val) => updatePreference("nag_for_feedback", val)}
      />

      {/* Auth Key Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Auth Key</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new auth key"
          value={authKey}
          onChangeText={setAuthKey}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={updateAuthKey}>
          <Text style={styles.saveBtnText}>Save Key</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
