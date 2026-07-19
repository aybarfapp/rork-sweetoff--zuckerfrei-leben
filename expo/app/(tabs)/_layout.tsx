import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Home, MessageCircle, ShieldAlert, User, Users } from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";

import MilestoneShare from "@/components/MilestoneShare";
import { GRADIENT } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

export default function TabLayout() {
  const { palette } = useAppStore();

  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textFaint,
        tabBarStyle: {
          backgroundColor: palette.tabBar,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 66,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="coach"
        options={{ title: "Coach", tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.sosWrap}>
              <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sosButton}>
                <ShieldAlert color="#fff" size={26} strokeWidth={2.4} />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{ title: "Community", tabBarIcon: ({ color }) => <Users color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", tabBarIcon: ({ color }) => <User color={color} size={24} /> }}
      />
    </Tabs>
    <MilestoneShare />
    </>
  );
}

const styles = StyleSheet.create({
  sosWrap: { alignItems: "center", justifyContent: "center" },
  sosButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? 24 : 18,
    shadowColor: "#FF5A2E",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
