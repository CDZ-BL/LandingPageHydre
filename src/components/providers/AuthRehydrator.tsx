'use client';

/**
 * AuthRehydrator
 *
 * Runs once on mount (client-side only). Reads the JWT from localStorage,
 * calls /api/account/stats to validate it, and restores the Zustand auth
 * state if the token is still valid.
 *
 * Without this, Zustand resets on every page refresh and the user is
 * effectively logged out despite having a valid token in localStorage.
 */

import { useEffect } from 'react';
import { useHydreStore } from '@/lib/store';

export function AuthRehydrator() {
    const { setUser, setAuthLoading } = useHydreStore();

    useEffect(() => {
        const rehydrate = async () => {
            const token = localStorage.getItem('hydre_auth_token');

            // Always signal loading so pages can wait before deciding to redirect
            setAuthLoading(true);

            // No token → nothing to rehydrate, but still mark loading as done
            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/account/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    // Token expired or invalid — clear it
                    localStorage.removeItem('hydre_auth_token');
                    return;
                }

                const data = await response.json();

                setUser({
                    id: data.profile.id,
                    email: data.profile.email,
                    displayName: data.profile.displayName,
                    emailVerified: data.profile.emailVerified,
                    referralCode: data.profile.referralCode,
                    founderPointsTotal: data.profile.founderPointsTotal,
                    walletBalanceCents: data.wallet?.balanceCents ?? 0,
                });
            } catch {
                // Network error — leave user logged out, keep token for retry
            } finally {
                setAuthLoading(false);
            }
        };

        rehydrate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
