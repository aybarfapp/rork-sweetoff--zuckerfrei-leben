import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { RADIUS } from "@/constants/theme";
import { dateKey, useAppStore } from "@/providers/AppStore";

const WEEKDAYS = ["M", "D", "M", "D", "F", "S", "S"];

type DayCell = { key: string; day: number; status: "success" | "relapse" | "future" | "empty" | "idle" };

/**
 * Month calendar marking streak days green (geschafft) and relapse days red.
 * Days before the streak start / after today are neutral.
 */
export default function StreakCalendar() {
  const { palette, streakStartISO, relapseDates } = useAppStore();

  const { label, cells } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthLabel = now.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

    const first = new Date(year, month, 1);
    // Monday-based offset (0 = Monday).
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = dateKey(now);
    const startKey = streakStartISO ? dateKey(new Date(streakStartISO)) : null;

    const list: DayCell[] = [];
    for (let i = 0; i < offset; i++) list.push({ key: `e-${i}`, day: 0, status: "empty" });

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const k = dateKey(cellDate);
      let status: DayCell["status"] = "idle";
      if (relapseDates.includes(k)) status = "relapse";
      else if (k > todayKey) status = "future";
      else if (startKey && k >= startKey && k <= todayKey) status = "success";
      list.push({ key: k, day: d, status });
    }
    return { label: monthLabel, cells: list };
  }, [streakStartISO, relapseDates]);

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.month, { color: palette.text }]}>{label}</Text>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={`${w}-${i}`} style={[styles.weekday, { color: palette.textFaint }]}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((c) => {
          if (c.status === "empty") return <View key={c.key} style={styles.cell} />;
          const bg =
            c.status === "success" ? palette.success : c.status === "relapse" ? "#E5484D" : "transparent";
          const border =
            c.status === "idle" || c.status === "future" ? palette.border : "transparent";
          const color =
            c.status === "success" || c.status === "relapse"
              ? "#fff"
              : c.status === "future"
                ? palette.textFaint
                : palette.textMuted;
          return (
            <View key={c.key} style={styles.cell}>
              <View style={[styles.dayDot, { backgroundColor: bg, borderColor: border, borderWidth: bg === "transparent" ? 1 : 0 }]}>
                <Text style={[styles.dayText, { color }]}>{c.day}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <Legend color={palette.success} label="Geschafft" />
        <Legend color="#E5484D" label="Rückfall" />
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { palette } = useAppStore();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.lg, borderWidth: 1, padding: 16 },
  month: { fontSize: 16, fontWeight: "800", textTransform: "capitalize", marginBottom: 14 },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekday: { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: `${100 / 7}%`, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  dayDot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dayText: { fontSize: 13, fontWeight: "700" },
  legend: { flexDirection: "row", gap: 20, marginTop: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, fontWeight: "600" },
});
