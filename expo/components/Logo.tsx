import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";

import { GRADIENT } from "@/constants/theme";

type Props = {
  size?: number;
  ringColor?: string;
};

/**
 * SweetOff brand mark: an open white ring around an isometric sugar cube,
 * both sliced by a red-orange lightning bolt from top-right to bottom-left.
 */
export default function Logo({ size = 96, ringColor = "#FFFFFF" }: Props) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <Svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <Defs>
          <SvgGradient id="bolt" x1="70" y1="12" x2="30" y2="88" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={GRADIENT[0]} />
            <Stop offset="1" stopColor={GRADIENT[1]} />
          </SvgGradient>
        </Defs>

        {/* Open ring (gap on the top-right where the bolt cuts through) */}
        <Path
          d="M62 12 A40 40 0 1 0 84 40"
          stroke={ringColor}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />

        {/* Isometric sugar cube - top face */}
        <Path d="M50 30 L66 39 L50 48 L34 39 Z" fill={ringColor} opacity={0.95} />
        {/* left face */}
        <Path d="M34 39 L50 48 L50 68 L34 59 Z" fill={ringColor} opacity={0.6} />
        {/* right face */}
        <Path d="M66 39 L66 59 L50 68 L50 48 Z" fill={ringColor} opacity={0.8} />

        {/* Lightning bolt slicing diagonally through ring + cube */}
        <Path
          d="M74 8 L44 50 L56 52 L30 92 L70 44 L56 42 Z"
          fill="url(#bolt)"
        />
      </Svg>
    </View>
  );
}

export function LogoBadge({ size = 64 }: { size?: number }) {
  return (
    <LinearGradient
      colors={["rgba(255,90,46,0.14)", "rgba(255,122,0,0.04)"]}
      style={{
        width: size,
        height: size,
        borderRadius: size / 3.2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logo size={size * 0.72} />
    </LinearGradient>
  );
}
