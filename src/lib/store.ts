import { create } from 'zustand';

export type Sport = 'crossfit' | 'hyrox' | 'running' | 'autre';
export type Flavor = 'yuzu-ginger' | 'berry-mint' | 'electric-lime';

interface FlavorVote {
    flavor: Flavor;
    taps: number;
    maxTaps: number;
    isCompleted: boolean;
}

interface AppState {
    // Waitlist state
    waitlistCount: number;
    userEmail: string;
    userSport: Sport | null;
    isSubmitted: boolean;

    // UI state
    isModalOpen: boolean;
    isConversionModalOpen: boolean;
    activeSection: string;
    isLowPowerMode: boolean;

    // Flavor Battle Game State
    flavorVotes: Record<Flavor, FlavorVote>;
    selectedFlavor: Flavor | null;
    isVoteComplete: boolean;
    gamePhase: 'intro' | 'playing' | 'voted' | 'converting';

    // Actions
    setUserEmail: (email: string) => void;
    setUserSport: (sport: Sport) => void;
    setIsSubmitted: (submitted: boolean) => void;
    openModal: () => void;
    closeModal: () => void;
    openConversionModal: () => void;
    closeConversionModal: () => void;
    setActiveSection: (section: string) => void;
    setLowPowerMode: (isLow: boolean) => void;
    incrementWaitlist: () => void;

    // Game Actions
    tapFlavor: (flavor: Flavor) => void;
    resetGame: () => void;
    setGamePhase: (phase: 'intro' | 'playing' | 'voted' | 'converting') => void;
}

const TAPS_TO_DISSOLVE = 20; // Number of taps needed to dissolve a tablet

const initialFlavorVotes: Record<Flavor, FlavorVote> = {
    'yuzu-ginger': { flavor: 'yuzu-ginger', taps: 0, maxTaps: TAPS_TO_DISSOLVE, isCompleted: false },
    'berry-mint': { flavor: 'berry-mint', taps: 0, maxTaps: TAPS_TO_DISSOLVE, isCompleted: false },
    'electric-lime': { flavor: 'electric-lime', taps: 0, maxTaps: TAPS_TO_DISSOLVE, isCompleted: false },
};

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    waitlistCount: 5437,
    userEmail: '',
    userSport: null,
    isSubmitted: false,
    isModalOpen: false,
    isConversionModalOpen: false,
    activeSection: 'hero',
    isLowPowerMode: false,

    // Game initial state
    flavorVotes: { ...initialFlavorVotes },
    selectedFlavor: null,
    isVoteComplete: false,
    gamePhase: 'intro',

    // Actions
    setUserEmail: (email) => set({ userEmail: email }),
    setUserSport: (sport) => set({ userSport: sport }),
    setIsSubmitted: (submitted) => set({ isSubmitted: submitted }),
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    openConversionModal: () => set({ isConversionModalOpen: true }),
    closeConversionModal: () => set({ isConversionModalOpen: false }),
    setActiveSection: (section) => set({ activeSection: section }),
    setLowPowerMode: (isLow) => set({ isLowPowerMode: isLow }),
    incrementWaitlist: () => set((state) => ({ waitlistCount: state.waitlistCount + 1 })),

    // Game Actions
    tapFlavor: (flavor) => {
        const state = get();
        if (state.isVoteComplete) return;

        const currentVote = state.flavorVotes[flavor];
        const newTaps = currentVote.taps + 1;
        const isCompleted = newTaps >= currentVote.maxTaps;

        set({
            flavorVotes: {
                ...state.flavorVotes,
                [flavor]: {
                    ...currentVote,
                    taps: newTaps,
                    isCompleted,
                },
            },
            gamePhase: 'playing',
            selectedFlavor: isCompleted ? flavor : state.selectedFlavor,
            isVoteComplete: isCompleted,
        });

        // Open conversion modal when vote is complete
        if (isCompleted) {
            setTimeout(() => {
                set({
                    isConversionModalOpen: true,
                    gamePhase: 'voted',
                });
            }, 1500); // Delay to show dissolution animation
        }
    },

    resetGame: () => set({
        flavorVotes: { ...initialFlavorVotes },
        selectedFlavor: null,
        isVoteComplete: false,
        gamePhase: 'intro',
    }),

    setGamePhase: (phase) => set({ gamePhase: phase }),
}));

// Flavor data with display info
export const FLAVOR_DATA: Record<Flavor, {
    name: string;
    displayName: string;
    color: string;
    secondaryColor: string;
    emoji: string;
    description: string;
}> = {
    'yuzu-ginger': {
        name: 'yuzu-ginger',
        displayName: 'Yuzu-Gingembre',
        color: '#FFD700',
        secondaryColor: '#FFA500',
        emoji: '🍋',
        description: 'Agrumes pétillants avec épice réchauffante',
    },
    'berry-mint': {
        name: 'berry-mint',
        displayName: 'Baies-Menthe',
        color: '#9B59B6',
        secondaryColor: '#4AE3B5',
        emoji: '🫐',
        description: 'Fraîcheur fruitée et mentholée',
    },
    'electric-lime': {
        name: 'electric-lime',
        displayName: 'Citron Électrique',
        color: '#32CD32',
        secondaryColor: '#FFD700',
        emoji: '⚡',
        description: 'Énergie acidulée intense',
    },
};
