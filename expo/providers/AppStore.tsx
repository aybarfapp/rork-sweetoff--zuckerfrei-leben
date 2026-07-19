import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

import { palettes, type Palette, type ThemeMode } from "@/constants/theme";

export type Answers = {
  gender?: "mann" | "frau" | "sonstige";
  birthYear?: number;
  frequency?: string;
  triggers: string[];
  triedBefore?: "ja" | "nein";
  goals: string[];
  startMode?: string;
  notifications?: boolean;
};

export type OwnPost = {
  id: string;
  day: number;
  text: string;
  createdISO: string;
};

/** Days that trigger a shareable milestone. */
export const MILESTONES = [3, 7, 14, 30, 60, 90] as const;

export type AppState = {
  hydrated: boolean;
  hasSubscribed: boolean;
  themeMode: ThemeMode;
  answers: Answers;
  streakStartISO: string | null;
  slipCount: number;
  sosCompleted: number;
  cravingsBeaten: number;
  cravingsGivenIn: number;
  longestStreak: number;
  relapseDates: string[];
  recentMessages: string[];
  celebratedMilestones: number[];
  ownPosts: OwnPost[];
};

const STORAGE_KEY = "sweetoff.state.v1";

const defaultAnswers: Answers = { triggers: [], goals: [] };

const defaultState: AppState = {
  hydrated: false,
  hasSubscribed: false,
  themeMode: "dark",
  answers: defaultAnswers,
  streakStartISO: null,
  slipCount: 0,
  sosCompleted: 0,
  cravingsBeaten: 0,
  cravingsGivenIn: 0,
  longestStreak: 0,
  relapseDates: [],
  recentMessages: [],
  celebratedMilestones: [],
  ownPosts: [],
};

/** Local date key yyyy-mm-dd. */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(startISO: string): number {
  const start = new Date(startISO).getTime();
  const diff = Date.now() - start;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export const [AppStoreProvider, useAppStore] = createContextHook(() => {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          setState((prev) => ({
            ...prev,
            ...parsed,
            answers: { ...defaultAnswers, ...(parsed.answers ?? {}) },
            relapseDates: parsed.relapseDates ?? [],
            recentMessages: parsed.recentMessages ?? [],
            celebratedMilestones: parsed.celebratedMilestones ?? [],
            ownPosts: parsed.ownPosts ?? [],
            hydrated: true,
          }));
        } else {
          setState((prev) => ({ ...prev, hydrated: true }));
        }
      } catch {
        setState((prev) => ({ ...prev, hydrated: true }));
      }
    })();
  }, []);

  const persist = useCallback((next: AppState) => {
    const { hydrated, ...toStore } = next;
    void hydrated;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore)).catch(() => {});
  }, []);

  const update = useCallback(
    (patch: Partial<AppState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const setAnswers = useCallback(
    (patch: Partial<Answers>) => {
      setState((prev) => {
        const next = { ...prev, answers: { ...prev.answers, ...patch } };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const toggleTheme = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, themeMode: prev.themeMode === "dark" ? ("light" as const) : ("dark" as const) };
      persist(next);
      return next;
    });
  }, [persist]);

  const startStreak = useCallback(() => {
    update({ streakStartISO: new Date().toISOString() });
  }, [update]);

  const resetStreak = useCallback(() => {
    setState((prev) => {
      const currentDays = prev.streakStartISO ? daysBetween(prev.streakStartISO) : 0;
      const today = dateKey(new Date());
      const next: AppState = {
        ...prev,
        streakStartISO: new Date().toISOString(),
        slipCount: prev.slipCount + 1,
        longestStreak: Math.max(prev.longestStreak, currentDays),
        relapseDates: prev.relapseDates.includes(today) ? prev.relapseDates : [...prev.relapseDates, today],
        celebratedMilestones: [],
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const completeSubscription = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        hasSubscribed: true,
        streakStartISO: prev.streakStartISO ?? new Date().toISOString(),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const incrementSos = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, sosCompleted: prev.sosCompleted + 1 };
      persist(next);
      return next;
    });
  }, [persist]);

  /** Record the outcome of a completed SOS craving flow. */
  const logCravingOutcome = useCallback(
    (outcome: "beaten" | "gaveIn", shownMessage?: string) => {
      setState((prev) => {
        const recent = shownMessage ? [shownMessage, ...prev.recentMessages].slice(0, 2) : prev.recentMessages;
        const next: AppState = {
          ...prev,
          sosCompleted: prev.sosCompleted + 1,
          cravingsBeaten: outcome === "beaten" ? prev.cravingsBeaten + 1 : prev.cravingsBeaten,
          cravingsGivenIn: outcome === "gaveIn" ? prev.cravingsGivenIn + 1 : prev.cravingsGivenIn,
          recentMessages: recent,
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  /** Mark a milestone day as celebrated so it isn't offered again. */
  const markMilestoneCelebrated = useCallback(
    (day: number) => {
      setState((prev) => {
        if (prev.celebratedMilestones.includes(day)) return prev;
        const next = { ...prev, celebratedMilestones: [...prev.celebratedMilestones, day] };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const shareMilestone = useCallback(
    (day: number, text: string) => {
      setState((prev) => {
        const post: OwnPost = { id: `own-${day}-${Date.now()}`, day, text, createdISO: new Date().toISOString() };
        const next: AppState = {
          ...prev,
          ownPosts: [post, ...prev.ownPosts],
          celebratedMilestones: prev.celebratedMilestones.includes(day)
            ? prev.celebratedMilestones
            : [...prev.celebratedMilestones, day],
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    const next = { ...defaultState, hydrated: true };
    setState(next);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const palette: Palette = useMemo(() => palettes[state.themeMode], [state.themeMode]);

  const streakDays = useMemo(() => {
    if (!state.streakStartISO) return 0;
    return daysBetween(state.streakStartISO);
  }, [state.streakStartISO]);

  const longestStreak = useMemo(() => Math.max(state.longestStreak, streakDays), [state.longestStreak, streakDays]);

  const successRate = useMemo(() => {
    const total = state.cravingsBeaten + state.cravingsGivenIn;
    if (total === 0) return null;
    return Math.round((state.cravingsBeaten / total) * 100);
  }, [state.cravingsBeaten, state.cravingsGivenIn]);

  /** The highest reached milestone that hasn't been celebrated yet, or null. */
  const pendingMilestone = useMemo(() => {
    const reached = MILESTONES.filter((m) => streakDays >= m && !state.celebratedMilestones.includes(m));
    return reached.length > 0 ? reached[reached.length - 1] : null;
  }, [streakDays, state.celebratedMilestones]);

  return useMemo(
    () => ({
      ...state,
      palette,
      streakDays,
      longestStreak,
      successRate,
      pendingMilestone,
      update,
      setAnswers,
      toggleTheme,
      startStreak,
      resetStreak,
      completeSubscription,
      incrementSos,
      logCravingOutcome,
      markMilestoneCelebrated,
      shareMilestone,
      resetAll,
    }),
    [
      state,
      palette,
      streakDays,
      longestStreak,
      successRate,
      pendingMilestone,
      update,
      setAnswers,
      toggleTheme,
      startStreak,
      resetStreak,
      completeSubscription,
      incrementSos,
      logCravingOutcome,
      markMilestoneCelebrated,
      shareMilestone,
      resetAll,
    ],
  );
});
