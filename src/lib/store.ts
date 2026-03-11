import { create } from 'zustand';

// ── TYPES ────────────────────────────────────────────────────

export interface HydreUser {
  id: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  referralCode: string;
  founderPointsTotal: number;
  cashbackBalanceCents: number;
  commissionBalanceCents: number;
}

export type AuthModal = 'closed' | 'login' | 'signup' | 'verify';
export type GamePhase = 'intro' | 'playing' | 'voted' | 'converting';
export type FlavorId = 'Fruits des bois' | 'Melon HoneyDew' | 'Poire';

interface HydreState {
  // ── Auth ─────────────────────────────────────
  user: HydreUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authModal: AuthModal;
  pendingVerificationEmail: string | null;

  // ── UI ───────────────────────────────────────
  isModalOpen: boolean;
  isConversionModalOpen: boolean;
  activeSection: number;
  isLowPowerMode: boolean;
  theme: 'dark' | 'light';

  // ── Waitlist ─────────────────────────────────
  waitlistCount: number;
  userEmail: string;
  userSport: string;
  isSubmitted: boolean;

  // ── Flavor Battle ────────────────────────────
  flavorVotes: Record<FlavorId, number>;
  selectedFlavor: FlavorId | null;
  isVoteComplete: boolean;
  gamePhase: GamePhase;

  // ── Auth Actions ─────────────────────────────
  setUser: (user: HydreUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  openAuthModal: (mode: AuthModal) => void;
  closeAuthModal: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
  logout: () => void;

  // ── UI Actions ───────────────────────────────
  setModalOpen: (open: boolean) => void;
  setConversionModalOpen: (open: boolean) => void;
  setActiveSection: (section: number) => void;
  setLowPowerMode: (low: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // ── Waitlist Actions ─────────────────────────
  setWaitlistCount: (count: number) => void;
  setUserEmail: (email: string) => void;
  setUserSport: (sport: string) => void;
  setSubmitted: (submitted: boolean) => void;

  // ── Flavor Battle Actions ────────────────────
  setFlavorVotes: (votes: Record<FlavorId, number>) => void;
  setSelectedFlavor: (flavor: FlavorId) => void;
  setVoteComplete: (complete: boolean) => void;
  setGamePhase: (phase: GamePhase) => void;
}

// ── STORE ────────────────────────────────────────────────────

export const useHydreStore = create<HydreState>((set) => ({
  // ── Auth State ───────────────────────────────
  user: null,
  isAuthenticated: false,
  isAuthLoading: true, // true until AuthRehydrator Phase 1 completes (instant localStorage check)
  authModal: 'closed',
  pendingVerificationEmail: null,

  // ── UI State ─────────────────────────────────
  isModalOpen: false,
  isConversionModalOpen: false,
  activeSection: 0,
  isLowPowerMode: false,
  theme: 'dark',

  // ── Waitlist State ───────────────────────────
  waitlistCount: 0,
  userEmail: '',
  userSport: '',
  isSubmitted: false,

  // ── Flavor Battle State ──────────────────────
  flavorVotes: {
    'Fruits des bois': 0,
    'Melon HoneyDew': 0,
    'Poire': 0,
  },
  selectedFlavor: null,
  isVoteComplete: false,
  gamePhase: 'intro',

  // ── Auth Actions ─────────────────────────────
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setAuthLoading: (loading) =>
    set({
      isAuthLoading: loading,
    }),

  openAuthModal: (mode) =>
    set({
      authModal: mode,
    }),

  closeAuthModal: () =>
    set({
      authModal: 'closed',
    }),

  setPendingVerificationEmail: (email) =>
    set({
      pendingVerificationEmail: email,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      authModal: 'closed',
      pendingVerificationEmail: null,
    }),

  // ── UI Actions ───────────────────────────────
  setModalOpen: (open) =>
    set({
      isModalOpen: open,
    }),

  setConversionModalOpen: (open) =>
    set({
      isConversionModalOpen: open,
    }),

  setActiveSection: (section) =>
    set({
      activeSection: section,
    }),

  setLowPowerMode: (low) =>
    set({
      isLowPowerMode: low,
    }),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        document.documentElement.dataset.theme = next;
        localStorage.setItem('hydre-theme', next);
        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', next === 'light' ? '#F0EAE0' : '#050505');
      }
      return { theme: next };
    }),

  setTheme: (theme) =>
    set(() => {
      if (typeof window !== 'undefined') {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('hydre-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#F0EAE0' : '#050505');
      }
      return { theme };
    }),

  // ── Waitlist Actions ─────────────────────────
  setWaitlistCount: (count) =>
    set({
      waitlistCount: count,
    }),

  setUserEmail: (email) =>
    set({
      userEmail: email,
    }),

  setUserSport: (sport) =>
    set({
      userSport: sport,
    }),

  setSubmitted: (submitted) =>
    set({
      isSubmitted: submitted,
    }),

  // ── Flavor Battle Actions ────────────────────
  setFlavorVotes: (votes) =>
    set({
      flavorVotes: votes,
    }),

  setSelectedFlavor: (flavor) =>
    set({
      selectedFlavor: flavor,
    }),

  setVoteComplete: (complete) =>
    set({
      isVoteComplete: complete,
    }),

  setGamePhase: (phase) =>
    set({
      gamePhase: phase,
    }),
}));
