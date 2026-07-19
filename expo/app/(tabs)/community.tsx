import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Crown, Flame, Heart, MessageCircle, Trophy, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GRADIENT, RADIUS } from "@/constants/theme";
import { useAppStore, type OwnPost } from "@/providers/AppStore";

type Ranked = { name: string; streak: number };

const WEEKLY: Ranked[] = [
  { name: "M. K.", streak: 45 },
  { name: "L. B.", streak: 41 },
  { name: "S. R.", streak: 38 },
  { name: "J. T.", streak: 34 },
  { name: "A. W.", streak: 31 },
  { name: "N. F.", streak: 29 },
  { name: "P. H.", streak: 26 },
  { name: "C. M.", streak: 23 },
  { name: "D. L.", streak: 21 },
  { name: "E. S.", streak: 19 },
];

const ALLTIME: Ranked[] = [
  { name: "T. G.", streak: 212 },
  { name: "M. K.", streak: 198 },
  { name: "R. V.", streak: 176 },
  { name: "L. B.", streak: 154 },
  { name: "S. R.", streak: 141 },
  { name: "K. D.", streak: 133 },
  { name: "A. W.", streak: 120 },
  { name: "J. T.", streak: 109 },
  { name: "N. F.", streak: 97 },
  { name: "P. H.", streak: 88 },
];

type FeedPost = {
  id: string;
  name: string;
  color: string;
  streak: number;
  time: string;
  text: string;
  likes: number;
  comments: number;
  milestone?: string;
};

const FEED: FeedPost[] = [
  { id: "1", name: "Jonas", color: "#FF5A2E", streak: 30, time: "vor 12 Min", text: "Tag 30 erreicht 🔥 Der Nachmittags-Schoko-Reflex ist einfach weg. An alle in Woche 1: es wird wirklich leichter.", likes: 84, comments: 12, milestone: "Tag 30" },
  { id: "2", name: "Mira", color: "#8B5CF6", streak: 6, time: "vor 34 Min", text: "Heute Abend fast schwach geworden vorm Fernseher. SOS-Button gedrückt, 60 Sekunden durchgeatmet – und der Drang war weg.", likes: 47, comments: 8 },
  { id: "3", name: "David", color: "#22C55E", streak: 7, time: "vor 1 Std", text: "Tag 7 🔥 Eine ganze Woche. Der Kopf ist klarer als seit Wochen. Danke an alle für die Motivation hier.", likes: 61, comments: 9, milestone: "Tag 7" },
  { id: "4", name: "Lea", color: "#F59E0B", streak: 12, time: "vor 2 Std", text: "Kleiner Rückfall gestern. Aber heute geht's einfach weiter. Kein Drama, kein Aufgeben. Streak neu gestartet, Kopf hoch.", likes: 63, comments: 19 },
];

export default function CommunityScreen() {
  const { palette, streakDays, ownPosts } = useAppStore();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<"week" | "all">("week");

  const board = range === "week" ? WEEKLY : ALLTIME;

  const myRank = useMemo(() => {
    const higher = board.filter((r) => r.streak > streakDays).length;
    return higher + 1;
  }, [board, streakDays]);

  const ownFeed = useMemo<OwnPost[]>(() => ownPosts, [ownPosts]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.text }]}>Community</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Ihr schafft das gemeinsam. Niemand kämpft allein.</Text>
        </View>

        {/* Leaderboard */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.boardHeader}>
            <View style={styles.boardTitleRow}>
              <Trophy size={20} color={palette.accent} />
              <Text style={[styles.boardTitle, { color: palette.text }]}>Leaderboard</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: palette.cardAlt }]}>
              {(["week", "all"] as const).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
                    setRange(r);
                  }}
                  style={[styles.toggleBtn, range === r && { backgroundColor: palette.accent }]}
                >
                  <Text style={[styles.toggleText, { color: range === r ? "#fff" : palette.textMuted }]}>{r === "week" ? "Diese Woche" : "Allzeit"}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.boardCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            {board.map((r, i) => (
              <View key={`${r.name}-${i}`} style={[styles.rankRow, i < board.length - 1 && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <View style={styles.rankLeft}>
                  {i < 3 ? (
                    <Crown size={18} color={["#FFD24A", "#C8CBD0", "#E08A4B"][i]} fill={["#FFD24A", "#C8CBD0", "#E08A4B"][i]} />
                  ) : (
                    <Text style={[styles.rankNum, { color: palette.textFaint }]}>{i + 1}</Text>
                  )}
                  <Text style={[styles.rankName, { color: palette.text }]}>{r.name}</Text>
                </View>
                <View style={styles.rankStreak}>
                  <Flame size={13} color={palette.accent} fill={palette.accent} />
                  <Text style={[styles.rankStreakText, { color: palette.textMuted }]}>Tag {r.streak}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Own placement highlighted */}
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.myRankCard}>
            <Text style={styles.myRankText}>Du: Platz {myRank}</Text>
            <View style={styles.myRankStreak}>
              <Flame size={15} color="#fff" fill="#fff" />
              <Text style={styles.myRankStreakText}>Tag {streakDays}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Challenge banner */}
        <View style={[styles.challenge, { backgroundColor: palette.card, borderColor: palette.accent }]}>
          <View style={[styles.challengeIcon, { backgroundColor: palette.accentDim }]}>
            <Users size={24} color={palette.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.challengeTitle, { color: palette.text }]}>Gemeinsame Challenge diese Woche</Text>
            <Text style={[styles.challengeSub, { color: palette.textMuted }]}>1.240 Nutzer sind gerade in der 7-Tage-Challenge.</Text>
          </View>
        </View>

        {/* Feed */}
        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Erfolge der Community</Text>
        </View>

        {ownFeed.map((p) => (
          <OwnPostCard key={p.id} post={p} />
        ))}
        {FEED.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </ScrollView>
    </View>
  );
}

function OwnPostCard({ post }: { post: OwnPost }) {
  const { palette } = useAppStore();
  return (
    <View style={[styles.post, { backgroundColor: palette.accentDim, borderColor: palette.accent }]}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: palette.accent }]}>
          <Text style={styles.avatarText}>DU</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.postName, { color: palette.text }]}>Du</Text>
            <View style={[styles.milestoneTag, { borderColor: palette.accent }]}>
              <Trophy size={12} color={palette.accent} />
              <Text style={[styles.milestoneTagText, { color: palette.accent }]}>Tag {post.day}</Text>
            </View>
          </View>
          <Text style={[styles.postTime, { color: palette.textFaint }]}>gerade eben</Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: palette.text }]}>{post.text}</Text>
    </View>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  const { palette } = useAppStore();
  const [liked, setLiked] = useState<boolean>(false);

  const toggleLike = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setLiked((l) => !l);
  };

  return (
    <View style={[styles.post, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: post.color }]}>
          <Text style={styles.avatarText}>{post.name.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.postName, { color: palette.text }]}>{post.name}</Text>
            <View style={[styles.streakBadge, { backgroundColor: palette.accentDim }]}>
              <Flame size={12} color={palette.accent} fill={palette.accent} />
              <Text style={[styles.streakBadgeText, { color: palette.accent }]}>{post.streak}</Text>
            </View>
          </View>
          <Text style={[styles.postTime, { color: palette.textFaint }]}>{post.time}</Text>
        </View>
        {post.milestone ? (
          <View style={[styles.milestoneTag, { borderColor: palette.accent }]}>
            <Trophy size={12} color={palette.accent} />
            <Text style={[styles.milestoneTagText, { color: palette.accent }]}>{post.milestone}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.postText, { color: palette.text }]}>{post.text}</Text>

      <View style={styles.actionsRow}>
        <Pressable onPress={toggleLike} style={styles.action}>
          <Heart size={19} color={liked ? palette.accent : palette.textMuted} fill={liked ? palette.accent : "transparent"} />
          <Text style={[styles.actionText, { color: liked ? palette.accent : palette.textMuted }]}>{post.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <View style={styles.action}>
          <MessageCircle size={19} color={palette.textMuted} />
          <Text style={[styles.actionText, { color: palette.textMuted }]}>{post.comments}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, marginBottom: 18 },
  title: { fontSize: 30, fontWeight: "900", letterSpacing: -0.6 },
  subtitle: { fontSize: 15, fontWeight: "500", marginTop: 4 },

  boardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  boardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  boardTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  toggle: { flexDirection: "row", borderRadius: RADIUS.pill, padding: 3 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: RADIUS.pill },
  toggleText: { fontSize: 12.5, fontWeight: "700" },

  boardCard: { borderRadius: RADIUS.lg, borderWidth: 1, paddingHorizontal: 16 },
  rankRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13 },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  rankNum: { fontSize: 15, fontWeight: "800", width: 18, textAlign: "center" },
  rankName: { fontSize: 15.5, fontWeight: "700" },
  rankStreak: { flexDirection: "row", alignItems: "center", gap: 5 },
  rankStreakText: { fontSize: 14, fontWeight: "600" },

  myRankCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: RADIUS.lg, padding: 16, marginTop: 12 },
  myRankText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  myRankStreak: { flexDirection: "row", alignItems: "center", gap: 6 },
  myRankStreakText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  challenge: { flexDirection: "row", alignItems: "center", gap: 14, marginHorizontal: 20, marginTop: 22, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1.5 },
  challengeIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  challengeTitle: { fontSize: 15.5, fontWeight: "800" },
  challengeSub: { fontSize: 13.5, fontWeight: "500", marginTop: 3 },

  sectionTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },

  post: { marginHorizontal: 20, marginTop: 14, padding: 16, borderRadius: RADIUS.lg, borderWidth: 1 },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  postName: { fontSize: 15.5, fontWeight: "800" },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 3, borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 2 },
  streakBadgeText: { fontSize: 12, fontWeight: "800" },
  postTime: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  milestoneTag: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1.5, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 4 },
  milestoneTagText: { fontSize: 12, fontWeight: "800" },

  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  postText: { fontSize: 15.5, fontWeight: "500", lineHeight: 23 },

  actionsRow: { flexDirection: "row", gap: 22, marginTop: 14 },
  action: { flexDirection: "row", alignItems: "center", gap: 7 },
  actionText: { fontSize: 14, fontWeight: "700" },
});
