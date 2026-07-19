import * as Haptics from "expo-haptics";
import { Send, Sparkles } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RADIUS } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

type Msg = { id: string; role: "coach" | "user"; text: string };

const QUICK = ["Ich habe gerade riesigen Drang", "Ich hatte einen Rückfall", "Motivier mich", "Warum tut das so weh?"];

function coachReply(input: string, name: string): string {
  const t = input.toLowerCase();
  if (t.includes("drang") || t.includes("heißhunger") || t.includes("lust")) {
    return "Atme einmal tief durch. Der Drang fühlt sich riesig an, aber er dauert selten länger als ein paar Minuten. Öffne den SOS-Button und surf die Welle mit mir ab – du musst ihr nicht folgen.";
  }
  if (t.includes("rückfall") || t.includes("versagt") || t.includes("aufgegeben")) {
    return "Ein Ausrutscher löscht nicht deinen Fortschritt. Er gehört dazu. Wichtig ist nur der nächste Moment – und der beginnt genau jetzt. Kein Grund zur Scham, nur Grund weiterzumachen.";
  }
  if (t.includes("motivier") || t.includes("motivation")) {
    return "Du hast dich entschieden, die Kontrolle zurückzuholen – das machen die wenigsten. Jeder Tag ohne Zucker-Autopilot ist ein Beweis, dass du stärker bist als die Gewohnheit. Bleib dran.";
  }
  if (t.includes("warum") || t.includes("weh") || t.includes("schwer")) {
    return "Zucker triggert im Gehirn dasselbe Belohnungssystem wie viele Süchte. Dass es schwerfällt, ist kein Zeichen von Schwäche – es ist Biologie. Und genau diese Reaktion wird mit jedem Tag schwächer.";
  }
  return `Ich bin bei dir${name ? "" : ""}. Erzähl mir, was gerade los ist – wann kommt der Drang, und was hast du bisher versucht? Gemeinsam finden wir deinen nächsten Schritt.`;
}

export default function CoachScreen() {
  const { palette } = useAppStore();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "coach",
      text: "Ich bin dein SweetOff-Coach – rund um die Uhr für dich da. Wenn der Drang kommt oder du einen Durchhänger hast, schreib mir einfach. Wie geht es dir gerade?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<ScrollView>(null);

  const send = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text) return;
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setTimeout(() => {
        setMessages((m) => [...m, { id: `c-${Date.now()}`, role: "coach", text: coachReply(text, "") }]);
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 550);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    },
    [input],
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: palette.border }]}>
        <View style={[styles.avatar, { backgroundColor: palette.accentDim }]}>
          <Sparkles size={22} color={palette.accent} />
        </View>
        <View>
          <Text style={[styles.headerTitle, { color: palette.text }]}>Dein Coach</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: palette.success }]} />
            <Text style={[styles.headerSub, { color: palette.textMuted }]}>Immer erreichbar</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 18, gap: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === "user"
                ? { backgroundColor: palette.accent, alignSelf: "flex-end", borderBottomRightRadius: 4 }
                : { backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1, alignSelf: "flex-start", borderBottomLeftRadius: 4 },
            ]}
          >
            <Text style={[styles.bubbleText, { color: m.role === "user" ? "#fff" : palette.text }]}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.quickRow}>
        {QUICK.map((q) => (
          <Pressable key={q} onPress={() => send(q)} style={[styles.quickChip, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.quickText, { color: palette.text }]}>{q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10, borderTopColor: palette.border, backgroundColor: palette.bg }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Schreib deinem Coach …"
          placeholderTextColor={palette.textFaint}
          style={[styles.input, { backgroundColor: palette.card, color: palette.text, borderColor: palette.border }]}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          multiline
        />
        <Pressable onPress={() => send()} style={[styles.sendBtn, { backgroundColor: input.trim() ? palette.accent : palette.cardAlt }]}>
          <Send size={20} color={input.trim() ? "#fff" : palette.textFaint} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingBottom: 14, borderBottomWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  headerSub: { fontSize: 13, fontWeight: "500" },

  bubble: { maxWidth: "82%", paddingVertical: 12, paddingHorizontal: 16, borderRadius: RADIUS.lg },
  bubbleText: { fontSize: 15.5, fontWeight: "500", lineHeight: 22 },

  quickRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10, paddingTop: 4 },
  quickChip: { borderRadius: RADIUS.pill, borderWidth: 1, paddingVertical: 9, paddingHorizontal: 14 },
  quickText: { fontSize: 13, fontWeight: "600" },

  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: RADIUS.lg, borderWidth: 1, paddingHorizontal: 16, paddingVertical: Platform.OS === "ios" ? 12 : 8, fontSize: 15.5, maxHeight: 120 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
});
