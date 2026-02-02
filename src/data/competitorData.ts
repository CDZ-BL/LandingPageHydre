// ═══════════════════════════════════════════════════════════════════════════
// AETHER — Competitive Analysis Data (Real Data)
// ═══════════════════════════════════════════════════════════════════════════

export interface CompetitorMetrics {
    price: number;          // € par boîte
    sugar: number;          // g per dose
    sodium: number;         // mg per dose
    potassium: number;      // mg per dose
    magnesium: number;      // mg per dose
    magnesiumForm: string;  // Type of magnesium
    vitaminC: number;       // mg per dose
    totalVitaminB: number;  // mg total B vitamins
    zinc: number;           // mg per dose
}

export interface Competitor {
    id: string;
    codeName: string;
    category: string;
    description: string;
    metrics: CompetitorMetrics;
}

// AETHER HYDRE V1.0 — Reference baseline (optimal values)
export const AETHER_DATA: Competitor = {
    id: 'aether',
    codeName: 'AETHER HYDRE',
    category: 'Référence',
    description: 'Système d\'hydratation cellulaire optimisé — Formule complète sans sucre',
    metrics: {
        price: 5.99,
        sugar: 0,
        sodium: 280,
        potassium: 150,
        magnesium: 60,
        magnesiumForm: 'Citrate',
        vitaminC: 77,
        totalVitaminB: 12.2,
        zinc: 3,
    }
};

// Competitor profiles with real data
export const COMPETITORS: Competitor[] = [
    {
        id: 'decathlon',
        codeName: 'DECATHLON',
        category: 'Sport',
        description: 'Hydratation sportive grande distribution — Formule basique à prix accessible',
        metrics: {
            price: 6.99,
            sugar: 0,
            sodium: 250,
            potassium: 100,
            magnesium: 56.3,
            magnesiumForm: 'Oxyde',
            vitaminC: 24,
            totalVitaminB: 1.17,
            zinc: 0,
        }
    },
    {
        id: 'hydratis',
        codeName: 'HYDRATIS',
        category: 'Pharmacie',
        description: 'Solution d\'hydratation pharmaceutique — Présence en pharmacie',
        metrics: {
            price: 9.99,
            sugar: 1.8,
            sodium: 58,
            potassium: 150,
            magnesium: 32.5,
            magnesiumForm: 'Citrate',
            vitaminC: 0,
            totalVitaminB: 0,
            zinc: 1,
        }
    },
    {
        id: 'waterdrop',
        codeName: 'WATERDROP',
        category: 'Marketing',
        description: 'Marque lifestyle hype — Fort sur le branding, faible sur la formule',
        metrics: {
            price: 7.49,
            sugar: 0,
            sodium: 0,
            potassium: 0,
            magnesium: 0,
            magnesiumForm: 'Aucun',
            vitaminC: 24,
            totalVitaminB: 6,
            zinc: 0,
        }
    }
];

// Radar chart axis configuration
// All axes: HIGHER value = BETTER product
// For inverted metrics: best = AETHER's value (lowest), worst = ceiling value
export const RADAR_AXES = [
    { key: 'price', label: 'ÉCONOMIQUE', inverted: true, best: 5.99, worst: 12 },     // Lower price = better
    { key: 'sugar', label: 'SANS SUCRE', inverted: true, best: 0, worst: 5 },       // Lower sugar = better
    { key: 'sodium', label: 'SODIUM', inverted: false, best: 280, worst: 0 },       // Higher = better
    { key: 'magnesium', label: 'MAGNÉSIUM', inverted: false, best: 60, worst: 0 },  // Higher = better
    { key: 'vitaminC', label: 'VIT. C', inverted: false, best: 77, worst: 0 },      // Higher = better
] as const;

// Helper to normalize a value for the radar (0-1 scale)
// Result: 1 = best (AETHER), 0 = worst
export function normalizeMetric(
    value: number,
    axis: typeof RADAR_AXES[number]
): number {
    if (axis.inverted) {
        // For inverted metrics (lower is better):
        // score = (worst - value) / (worst - best)
        // AETHER (best): (worst - best) / (worst - best) = 1
        // Competitor at worst: (worst - worst) / (worst - best) = 0
        const range = axis.worst - axis.best;
        if (range === 0) return 1;
        return Math.max(0, Math.min(1, (axis.worst - value) / range));
    } else {
        // For normal metrics (higher is better):
        // score = value / best
        // AETHER: best / best = 1
        return Math.min(1, value / axis.best);
    }
}
