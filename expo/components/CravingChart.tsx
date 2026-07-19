import { Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { GRADIENT } from "@/constants/theme";
import { useAppStore } from "@/providers/AppStore";

type Milestone = { day: number; label: string };

const MILESTONES: Milestone[] = [
  { day: 3, label: "Tag 3" },
  { day: 10, label: "Tag 10" },
  { day: 21, label: "Tag 21" },
];

/**
 * Declining craving-intensity curve over 21 days with milestone markers.
 */
export default function CravingChart({ width = 300, height = 180 }: { width?: number; height?: number }) {
  const { palette } = useAppStore();
  const padX = 14;
  const padY = 18;
  const w = width - padX * 2;
  const h = height - padY * 2;

  // Craving intensity decay curve (normalized 0..1) over 21 days.
  const value = (day: number) => Math.pow(1 - day / 21, 1.5) * 0.9 + 0.08;
  const x = (day: number) => padX + (day / 21) * w;
  const y = (v: number) => padY + (1 - v) * h;

  const points: string[] = [];
  for (let d = 0; d <= 21; d += 0.5) {
    points.push(`${x(d).toFixed(1)},${y(value(d)).toFixed(1)}`);
  }
  const line = `M ${points.join(" L ")}`;
  const area = `${line} L ${x(21)},${padY + h} L ${x(0)},${padY + h} Z`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={GRADIENT[0]} />
            <Stop offset="1" stopColor={GRADIENT[1]} />
          </LinearGradient>
          <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={GRADIENT[0]} stopOpacity={0.28} />
            <Stop offset="1" stopColor={GRADIENT[0]} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={area} fill="url(#fill)" />
        <Path d={line} stroke="url(#stroke)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {MILESTONES.map((m) => (
          <Circle key={m.day} cx={x(m.day)} cy={y(value(m.day))} r={5} fill={palette.bg} stroke={GRADIENT[1]} strokeWidth={3} />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingHorizontal: 4 }}>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: "600" }}>Tag 1</Text>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: "600" }}>Tag 10</Text>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: "600" }}>Tag 21</Text>
      </View>
    </View>
  );
}
