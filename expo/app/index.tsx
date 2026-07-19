import { Redirect } from "expo-router";
import { View } from "react-native";

import { useAppStore } from "@/providers/AppStore";

export default function Index() {
  const { hydrated, hasSubscribed, palette } = useAppStore();

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: palette.bg }} />;
  }

  if (hasSubscribed) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/onboarding" />;
}
