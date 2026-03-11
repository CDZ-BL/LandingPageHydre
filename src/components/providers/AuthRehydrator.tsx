'use client';

/**
 * AuthRehydrator — Instant Auth Restoration (Phase 1 only)
 *
 * Reads the JWT from localStorage synchronously on mount.
 * If present, sets a provisional user state immediately (<1ms) so the
 * Header renders "Compte" without waiting for any network call.
 *
 * Token validation happens lazily: each authenticated page/component
 * fetches its own data and handles 401 → logout itself.
 * This avoids a redundant /api/account/stats call on every page load.
 */

import { useEffect } from 'react';
import { useHydreStore } from '@/lib/store';

export function AuthRehydrator() {
    const { setUser, setAuthLoading } = useHydreStore();

    useEffect(() => {
        const token = localStorage.getItem('hydre_auth_token');

        if (!token) {
            // Definitively not logged in
            setAuthLoading(false);
            return;
        }

        // Token present → set provisional auth state instantly (no network call)
        // The account page will validate the token on its own fetch
        // and call logout() if it gets a 401
        setUser({
            id: '',
            email: '',
            displayName: null,
            emailVerified: false,
            referralCode: '',
            founderPointsTotal: 0,
            cashbackBalanceCents: 0,
            commissionBalanceCents: 0,
        });
        setAuthLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

