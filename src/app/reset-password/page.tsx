'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CLINICAL_EASING = [0.87, 0, 0.13, 1];

const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
	const errors: string[] = [];
	if (password.length < 8) errors.push('Au moins 8 caractères');
	if (!/[A-Z]/.test(password)) errors.push('Au moins 1 majuscule');
	if (!/[0-9]/.test(password)) errors.push('Au moins 1 chiffre');
	return { valid: errors.length === 0, errors };
};

function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!token) {
			setError('Lien invalide. Veuillez faire une nouvelle demande de réinitialisation.');
		}
	}, [token]);

	const passwordValidation = validatePassword(newPassword);

	const handleSubmit = useCallback(async () => {
		setError(null);

		if (!token) {
			setError('Lien invalide.');
			return;
		}

		if (!passwordValidation.valid) {
			setError(passwordValidation.errors[0]);
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('Les mots de passe ne correspondent pas.');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, newPassword }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Erreur lors de la réinitialisation.');
			} else {
				setSuccess(true);
			}
		} catch {
			setError('Erreur réseau. Veuillez réessayer.');
		} finally {
			setLoading(false);
		}
	}, [token, newPassword, confirmPassword, passwordValidation.valid]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !loading) handleSubmit();
		},
		[loading, handleSubmit]
	);

	return (
		<div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, ease: CLINICAL_EASING }}
				className="w-full max-w-md"
			>
				{/* Glass card */}
				<div className="relative">
					<div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-sm border border-white/10" />
					<div className="relative p-8">
						{success ? (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="text-center"
							>
								{/* Success icon */}
								<div className="w-12 h-12 mx-auto mb-6 rounded-full border border-[#39FF14]/40 flex items-center justify-center">
									<svg
										className="w-6 h-6 text-[#39FF14]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>

								<h1 className="font-headline text-xl uppercase tracking-[0.2em] text-white mb-3">
									Mot de passe modifié
								</h1>
								<p className="font-mono text-[11px] text-white/50 mb-8 leading-relaxed">
									Votre mot de passe a été mis à jour avec succès.
									<br />
									Vous pouvez maintenant vous connecter.
								</p>

								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									onClick={() => router.push('/')}
									className="w-full py-3 px-4 rounded-sm font-mono text-sm uppercase tracking-[0.15em] bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all duration-300"
								>
									Retour à l'accueil
								</motion.button>
							</motion.div>
						) : (
							<>
								{/* Header */}
								<div className="mb-8">
									<h1 className="font-headline text-xl uppercase tracking-[0.2em] text-white mb-2">
										Nouveau mot de passe
									</h1>
									<p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
										Choisissez un nouveau mot de passe sécurisé
									</p>
								</div>

								{/* New password */}
								<div className="mb-6">
									<div className="flex items-center justify-between mb-2">
										<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
											Nouveau mot de passe
										</label>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white/60 transition-colors"
										>
											{showPassword ? 'Masquer' : 'Afficher'}
										</button>
									</div>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										value={newPassword}
										onChange={(e) => {
											setNewPassword(e.target.value);
											setError(null);
										}}
										onKeyDown={handleKeyDown}
										className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6B00]/50 focus:bg-white/[0.06] transition-all duration-300"
									/>
									{/* Password requirements */}
									<div className="mt-2 space-y-1">
										<p className={cn('font-mono text-[9px] transition-colors duration-200', newPassword.length >= 8 ? 'text-[#39FF14]' : 'text-white/30')}>
											✓ 8 caractères minimum
										</p>
										<p className={cn('font-mono text-[9px] transition-colors duration-200', /[A-Z]/.test(newPassword) ? 'text-[#39FF14]' : 'text-white/30')}>
											✓ 1 majuscule minimum
										</p>
										<p className={cn('font-mono text-[9px] transition-colors duration-200', /[0-9]/.test(newPassword) ? 'text-[#39FF14]' : 'text-white/30')}>
											✓ 1 chiffre minimum
										</p>
									</div>
								</div>

								{/* Confirm password */}
								<div className="mb-6">
									<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-2">
										Confirmer le mot de passe
									</label>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											setError(null);
										}}
										onKeyDown={handleKeyDown}
										className={cn(
											'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
											'font-mono text-sm text-white placeholder:text-white/20',
											'focus:outline-none transition-all duration-300',
											confirmPassword && confirmPassword !== newPassword
												? 'border-red-500/50 focus:border-red-500/50'
												: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
										)}
									/>
								</div>

								{/* Error */}
								{error && (
									<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
										<p className="font-mono text-[10px] text-red-500/90">{error}</p>
									</div>
								)}

								{/* Submit */}
								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									onClick={handleSubmit}
									disabled={loading || !passwordValidation.valid || !token}
									className={cn(
										'w-full py-3 px-4 rounded-sm font-mono text-sm uppercase tracking-[0.15em]',
										'transition-all duration-300',
										loading || !passwordValidation.valid || !token
											? 'bg-[#FF6B00]/50 text-white/50 cursor-not-allowed'
											: 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30'
									)}
								>
									{loading ? (
										<div className="flex items-center justify-center">
											<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
										</div>
									) : (
										'Réinitialiser le mot de passe'
									)}
								</motion.button>

								{/* Back to home */}
								<div className="mt-6 text-center">
									<button
										onClick={() => router.push('/')}
										className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors duration-200"
									>
										← Retour à l'accueil
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#050505] flex items-center justify-center">
					<div className="w-6 h-6 border-2 border-white/20 border-t-[#FF6B00] rounded-full animate-spin" />
				</div>
			}
		>
			<ResetPasswordForm />
		</Suspense>
	);
}
