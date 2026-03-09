'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHydreStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type AuthView = 'login' | 'signup' | 'verify';

interface FormState {
	email: string;
	password: string;
	confirmPassword: string;
	referralCode: string;
	verificationCodes: string[];
}

interface ErrorState {
	field?: string;
	message: string;
}

const SMOOTH_EASING = [0.25, 0.1, 0.25, 1.0];
const CLINICAL_EASING = [0.87, 0, 0.13, 1];

const modalVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.95 },
};

const viewVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 400 : -400,
		opacity: 0,
	}),
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		x: direction < 0 ? 400 : -400,
		opacity: 0,
	}),
};

export function AuthModal() {
	const {
		authModal,
		openAuthModal,
		closeAuthModal,
		setUser,
		pendingVerificationEmail,
		setPendingVerificationEmail,
	} = useHydreStore();

	const [view, setView] = useState<AuthView>('login');
	const [direction, setDirection] = useState(0);
	const [formState, setFormState] = useState<FormState>({
		email: '',
		password: '',
		confirmPassword: '',
		referralCode: '',
		verificationCodes: ['', '', '', '', '', ''],
	});
	const [error, setError] = useState<ErrorState | null>(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const [verifyTimer, setVerifyTimer] = useState(600); // 10 minutes
	const verifyTimerRef = useRef<NodeJS.Timeout | null>(null);
	const resendTimerRef = useRef<NodeJS.Timeout | null>(null);
	const verificationInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Sync internal view with store authModal when it opens
	useEffect(() => {
		if (authModal !== 'closed') {
			setView(authModal as AuthView);
		}
	}, [authModal]);

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
			if (resendTimerRef.current) clearInterval(resendTimerRef.current);
		};
	}, []);

	// Start verification timer when entering verify view
	useEffect(() => {
		if (authModal && view === 'verify') {
			setVerifyTimer(600); // Reset to 10 minutes
			verifyTimerRef.current = setInterval(() => {
				setVerifyTimer((prev) => {
					if (prev <= 1) {
						if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
		};
	}, [authModal, view]);

	// Start resend timer
	useEffect(() => {
		if (resendTimer > 0) {
			resendTimerRef.current = setInterval(() => {
				setResendTimer((prev) => {
					if (prev <= 1) {
						if (resendTimerRef.current) clearInterval(resendTimerRef.current);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (resendTimerRef.current) clearInterval(resendTimerRef.current);
		};
	}, [resendTimer]);

	const handleClose = useCallback(() => {
		closeAuthModal();
		// Reset form after animation
		setTimeout(() => {
			setView('login');
			setFormState({
				email: '',
				password: '',
				confirmPassword: '',
				referralCode: '',
				verificationCodes: ['', '', '', '', '', ''],
			});
			setError(null);
			setShowPassword(false);
			setShowConfirmPassword(false);
			setResendTimer(0);
			setVerifyTimer(600);
		}, 300);
	}, [closeAuthModal]);

	const handleInputChange = useCallback(
		(field: keyof FormState, value: string) => {
			setFormState((prev) => ({
				...prev,
				[field]: value,
			}));
			setError(null); // Clear error on input change
		},
		[]
	);

	const handleVerificationCodeChange = useCallback(
		(index: number, value: string) => {
			const numericValue = value.replace(/[^0-9]/g, '');

			if (numericValue.length > 1) {
				// Paste behavior: split into individual digits
				const codes = [...formState.verificationCodes];
				const digits = numericValue.split('');
				for (let i = 0; i < Math.min(digits.length, 6 - index); i++) {
					codes[index + i] = digits[i];
				}
				setFormState((prev) => ({
					...prev,
					verificationCodes: codes,
				}));

				// Focus last filled input
				const lastFilledIndex = Math.min(index + digits.length - 1, 5);
				verificationInputRefs.current[lastFilledIndex]?.focus();

				// Auto-submit if all filled
				if (codes.every((code) => code !== '')) {
					handleVerifyEmail(codes.join(''));
				}
			} else {
				const codes = [...formState.verificationCodes];
				codes[index] = numericValue;
				setFormState((prev) => ({
					...prev,
					verificationCodes: codes,
				}));

				// Auto-advance to next input
				if (numericValue && index < 5) {
					verificationInputRefs.current[index + 1]?.focus();
				}

				// Auto-submit if all filled
				if (codes.every((code) => code !== '')) {
					handleVerifyEmail(codes.join(''));
				}
			}

			setError(null);
		},
		[formState.verificationCodes]
	);

	const handleVerificationKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Backspace' && !formState.verificationCodes[index] && index > 0) {
				verificationInputRefs.current[index - 1]?.focus();
			}
		},
		[formState.verificationCodes]
	);

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (password.length < 8) {
			errors.push('Au moins 8 caractères');
		}
		if (!/[A-Z]/.test(password)) {
			errors.push('Au moins 1 majuscule');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('Au moins 1 chiffre');
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	};

	const handleLogin = useCallback(async () => {
		setError(null);
		setLoading(true);

		if (!formState.email.trim()) {
			setError({ field: 'email', message: 'E-mail requis' });
			setLoading(false);
			return;
		}

		if (!validateEmail(formState.email)) {
			setError({ field: 'email', message: 'Format e-mail invalide' });
			setLoading(false);
			return;
		}

		if (!formState.password) {
			setError({ field: 'password', message: 'Mot de passe requis' });
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: formState.email,
					password: formState.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 403 && data.needsVerification) {
					setPendingVerificationEmail(formState.email);
					setDirection(1);
					setView('verify');
					setFormState((prev) => ({
						...prev,
						verificationCodes: ['', '', '', '', '', ''],
					}));
					setResendTimer(60);
				} else {
					setError({
						message: data.message || 'Erreur de connexion',
					});
				}
			} else {
				// Fetch user profile
				const profileResponse = await fetch('/api/account/stats');
				const userProfile = await profileResponse.json();

				if (profileResponse.ok) {
					setUser(userProfile);
				}

				handleClose();
			}
		} catch (err) {
			setError({
				message: err instanceof Error ? err.message : 'Erreur réseau',
			});
		} finally {
			setLoading(false);
		}
	}, [formState.email, formState.password, handleClose, setUser, setPendingVerificationEmail]);

	const handleSignup = useCallback(async () => {
		setError(null);
		setLoading(true);

		if (!formState.email.trim()) {
			setError({ field: 'email', message: 'E-mail requis' });
			setLoading(false);
			return;
		}

		if (!validateEmail(formState.email)) {
			setError({ field: 'email', message: 'Format e-mail invalide' });
			setLoading(false);
			return;
		}

		const passwordValidation = validatePassword(formState.password);
		if (!passwordValidation.valid) {
			setError({
				field: 'password',
				message: passwordValidation.errors[0],
			});
			setLoading(false);
			return;
		}

		if (formState.password !== formState.confirmPassword) {
			setError({
				field: 'confirmPassword',
				message: 'Les mots de passe ne correspondent pas',
			});
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: formState.email,
					password: formState.password,
					referralCode: formState.referralCode || undefined,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError({
					message: data.message || 'Erreur lors de l\'inscription',
				});
			} else {
				setPendingVerificationEmail(formState.email);
				setDirection(1);
				setView('verify');
				setFormState((prev) => ({
					...prev,
					verificationCodes: ['', '', '', '', '', ''],
				}));
				setResendTimer(60);
			}
		} catch (err) {
			setError({
				message: err instanceof Error ? err.message : 'Erreur réseau',
			});
		} finally {
			setLoading(false);
		}
	}, [
		formState.email,
		formState.password,
		formState.confirmPassword,
		formState.referralCode,
		setPendingVerificationEmail,
	]);

	const handleVerifyEmail = useCallback(
		async (code?: string) => {
			const verificationCode = code || formState.verificationCodes.join('');

			if (verificationCode.length !== 6) {
				setError({ message: 'Code incomplet' });
				return;
			}

			setError(null);
			setLoading(true);

			try {
				const response = await fetch('/api/auth/verify-email', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: pendingVerificationEmail,
						code: verificationCode,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					setError({
						message: data.message || 'Code invalide',
					});
					setFormState((prev) => ({
						...prev,
						verificationCodes: ['', '', '', '', '', ''],
					}));
					verificationInputRefs.current[0]?.focus();
				} else {
					// Email verified — now auto-login with stored credentials
					// to get a session token, then fetch profile
					const loginResponse = await fetch('/api/auth/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: pendingVerificationEmail,
							password: formState.password,
						}),
					});

					const loginData = await loginResponse.json();

					if (loginResponse.ok && loginData.session?.access_token) {
						// Store token for future authenticated requests
						localStorage.setItem('hydre_auth_token', loginData.session.access_token);

						// Fetch full profile with the fresh token
						const profileResponse = await fetch('/api/account/stats', {
							headers: {
								Authorization: `Bearer ${loginData.session.access_token}`,
							},
						});
						const statsData = await profileResponse.json();

						if (profileResponse.ok) {
							setUser({
								id: statsData.profile.id,
								email: statsData.profile.email,
								displayName: statsData.profile.displayName,
								emailVerified: statsData.profile.emailVerified,
								referralCode: statsData.profile.referralCode,
								founderPointsTotal: statsData.profile.founderPointsTotal,
								walletBalanceCents: statsData.wallet?.balanceCents ?? 0,
							});
						}
					}

					handleClose();
				}
			} catch (err) {
				setError({
					message: err instanceof Error ? err.message : 'Erreur réseau',
				});
			} finally {
				setLoading(false);
			}
		},
		[formState.verificationCodes, formState.password, pendingVerificationEmail, handleClose, setUser]
	);

	const handleResendCode = useCallback(async () => {
		setError(null);

		try {
			const response = await fetch('/api/auth/resend-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: pendingVerificationEmail,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				setError({
					message: data.message || 'Erreur lors de l\'envoi du code',
				});
			} else {
				setResendTimer(60);
			}
		} catch (err) {
			setError({
				message: err instanceof Error ? err.message : 'Erreur réseau',
			});
		}
	}, [pendingVerificationEmail]);

	const handleSwitchView = useCallback((newView: AuthView) => {
		setDirection(newView === 'signup' || newView === 'verify' ? 1 : -1);
		setView(newView);
		setError(null);
		setFormState((prev) => ({
			...prev,
			password: '',
			confirmPassword: '',
		}));
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !loading && view !== 'verify') {
				if (view === 'login') {
					handleLogin();
				} else if (view === 'signup') {
					handleSignup();
				}
			}
		},
		[view, loading, handleLogin, handleSignup]
	);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const passwordValidation = validatePassword(formState.password);

	const isOpen = authModal !== 'closed';
	if (!isOpen) return null;

	return (
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					key="auth-modal-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={handleClose}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
				>
					<motion.div
						key="auth-modal-content"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={modalVariants}
						transition={{ duration: 0.3, ease: CLINICAL_EASING }}
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-md mx-4"
					>
						{/* Glass card background */}
						<div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-sm border border-white/10" />

						{/* Content wrapper */}
						<div className="relative p-8">
							{/* Close button */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleClose}
								className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/90 transition-colors duration-200"
								aria-label="Close modal"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</motion.button>

							{/* View transitions */}
							<AnimatePresence mode="wait">
								{view === 'login' && (
									<motion.div
										key="login-view"
										custom={direction}
										initial="enter"
										animate="center"
										exit="exit"
										variants={viewVariants}
										transition={{ duration: 0.3, ease: SMOOTH_EASING }}
										onKeyDown={handleKeyDown}
									>
										{/* Title */}
										<h2 className="font-headline text-xl uppercase tracking-[0.2em] text-white mb-2">
											Connexion
										</h2>

										{/* Subtitle */}
										<p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 mb-8">
											Accédez à votre espace HYDRE
										</p>

										{/* Email input */}
										<div className="mb-6">
											<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-2">
												Email
											</label>
											<input
												type="email"
												placeholder="vous@example.com"
												value={formState.email}
												onChange={(e) =>
													handleInputChange('email', e.target.value)
												}
												onKeyDown={handleKeyDown}
												className={cn(
													'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
													'font-mono text-sm text-white placeholder:text-white/20',
													'focus:outline-none transition-all duration-300',
													error?.field === 'email'
														? 'border-red-500/50 focus:border-red-500/50'
														: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
												)}
											/>
											{error?.field === 'email' && (
												<p className="font-mono text-[10px] text-red-500/70 mt-1">
													{error.message}
												</p>
											)}
										</div>

										{/* Password input */}
										<div className="mb-6">
											<div className="flex items-center justify-between mb-2">
												<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
													Mot de passe
												</label>
												<button
													type="button"
													onClick={() =>
														setShowPassword(!showPassword)
													}
													className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white/60 transition-colors"
												>
													{showPassword ? 'Masquer' : 'Afficher'}
												</button>
											</div>
											<input
												type={showPassword ? 'text' : 'password'}
												placeholder="••••••••"
												value={formState.password}
												onChange={(e) =>
													handleInputChange('password', e.target.value)
												}
												onKeyDown={handleKeyDown}
												className={cn(
													'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
													'font-mono text-sm text-white placeholder:text-white/20',
													'focus:outline-none transition-all duration-300',
													error?.field === 'password'
														? 'border-red-500/50 focus:border-red-500/50'
														: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
												)}
											/>
											{error?.field === 'password' && (
												<p className="font-mono text-[10px] text-red-500/70 mt-1">
													{error.message}
												</p>
											)}
										</div>

										{/* General error */}
										{error && !error.field && (
											<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
												<p className="font-mono text-[10px] text-red-500/90">
													{error.message}
												</p>
											</div>
										)}

										{/* Submit button */}
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={handleLogin}
											disabled={loading}
											className={cn(
												'w-full py-3 px-4 rounded-sm font-mono text-sm uppercase tracking-[0.15em]',
												'transition-all duration-300',
												loading
													? 'bg-[#FF6B00]/50 text-white/50 cursor-not-allowed'
													: 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30'
											)}
										>
											{loading ? (
												<div className="flex items-center justify-center">
													<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												</div>
											) : (
												'Se connecter'
											)}
										</motion.button>

										{/* Switch to signup */}
										<div className="mt-6 text-center">
											<p className="font-mono text-[10px] text-white/40">
												Pas encore de compte ?{' '}
												<button
													onClick={() =>
														handleSwitchView('signup')
													}
													className="text-[#FF6B00] hover:text-[#FF8533] transition-colors duration-200"
												>
													S'inscrire
												</button>
											</p>
										</div>
									</motion.div>
								)}

								{view === 'signup' && (
									<motion.div
										key="signup-view"
										custom={direction}
										initial="enter"
										animate="center"
										exit="exit"
										variants={viewVariants}
										transition={{ duration: 0.3, ease: SMOOTH_EASING }}
										onKeyDown={handleKeyDown}
									>
										{/* Title */}
										<h2 className="font-headline text-xl uppercase tracking-[0.2em] text-white mb-2">
											Inscription
										</h2>

										{/* Subtitle */}
										<p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 mb-8">
											Rejoignez le programme HYDRE
										</p>

										{/* Email input */}
										<div className="mb-6">
											<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-2">
												Email
											</label>
											<input
												type="email"
												placeholder="vous@example.com"
												value={formState.email}
												onChange={(e) =>
													handleInputChange('email', e.target.value)
												}
												onKeyDown={handleKeyDown}
												className={cn(
													'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
													'font-mono text-sm text-white placeholder:text-white/20',
													'focus:outline-none transition-all duration-300',
													error?.field === 'email'
														? 'border-red-500/50 focus:border-red-500/50'
														: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
												)}
											/>
											{error?.field === 'email' && (
												<p className="font-mono text-[10px] text-red-500/70 mt-1">
													{error.message}
												</p>
											)}
										</div>

										{/* Password input */}
										<div className="mb-6">
											<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-2">
												Mot de passe
											</label>
											<input
												type={showPassword ? 'text' : 'password'}
												placeholder="••••••••"
												value={formState.password}
												onChange={(e) =>
													handleInputChange('password', e.target.value)
												}
												onKeyDown={handleKeyDown}
												className={cn(
													'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
													'font-mono text-sm text-white placeholder:text-white/20',
													'focus:outline-none transition-all duration-300',
													error?.field === 'password'
														? 'border-red-500/50 focus:border-red-500/50'
														: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
												)}
											/>
											{/* Password requirements */}
											<div className="mt-2 space-y-1">
												<p
													className={cn(
														'font-mono text-[9px] transition-colors duration-200',
														formState.password.length >= 8
															? 'text-[#39FF14]'
															: 'text-white/30'
													)}
												>
													✓ 8 caractères minimum
												</p>
												<p
													className={cn(
														'font-mono text-[9px] transition-colors duration-200',
														/[A-Z]/.test(formState.password)
															? 'text-[#39FF14]'
															: 'text-white/30'
													)}
												>
													✓ 1 majuscule minimum
												</p>
												<p
													className={cn(
														'font-mono text-[9px] transition-colors duration-200',
														/[0-9]/.test(formState.password)
															? 'text-[#39FF14]'
															: 'text-white/30'
													)}
												>
													✓ 1 chiffre minimum
												</p>
											</div>
										</div>

										{/* Confirm password input */}
										<div className="mb-6">
											<div className="flex items-center justify-between mb-2">
												<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
													Confirmer mot de passe
												</label>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white/60 transition-colors"
												>
													{showConfirmPassword
														? 'Masquer'
														: 'Afficher'}
												</button>
											</div>
											<input
												type={
													showConfirmPassword
														? 'text'
														: 'password'
												}
												placeholder="••••••••"
												value={formState.confirmPassword}
												onChange={(e) =>
													handleInputChange(
														'confirmPassword',
														e.target.value
													)
												}
												onKeyDown={handleKeyDown}
												className={cn(
													'w-full bg-white/[0.04] border rounded-sm px-4 py-3',
													'font-mono text-sm text-white placeholder:text-white/20',
													'focus:outline-none transition-all duration-300',
													error?.field === 'confirmPassword'
														? 'border-red-500/50 focus:border-red-500/50'
														: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
												)}
											/>
											{error?.field === 'confirmPassword' && (
												<p className="font-mono text-[10px] text-red-500/70 mt-1">
													{error.message}
												</p>
											)}
										</div>

										{/* Referral code input */}
										<div className="mb-6">
											<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-2">
												Code parrainage (optionnel)
											</label>
											<input
												type="text"
												placeholder="HYDRE-XXX"
												value={formState.referralCode}
												onChange={(e) =>
													handleInputChange(
														'referralCode',
														e.target.value
													)
												}
												onKeyDown={handleKeyDown}
												className="w-full bg-white/[0.04] border border-white/10 rounded-sm px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6B00]/50 focus:bg-white/[0.06] transition-all duration-300"
											/>
										</div>

										{/* General error */}
										{error && !error.field && (
											<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
												<p className="font-mono text-[10px] text-red-500/90">
													{error.message}
												</p>
											</div>
										)}

										{/* Submit button */}
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={handleSignup}
											disabled={loading || !passwordValidation.valid}
											className={cn(
												'w-full py-3 px-4 rounded-sm font-mono text-sm uppercase tracking-[0.15em]',
												'transition-all duration-300',
												loading || !passwordValidation.valid
													? 'bg-[#FF6B00]/50 text-white/50 cursor-not-allowed'
													: 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30'
											)}
										>
											{loading ? (
												<div className="flex items-center justify-center">
													<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												</div>
											) : (
												'Créer mon compte'
											)}
										</motion.button>

										{/* Switch to login */}
										<div className="mt-6 text-center">
											<p className="font-mono text-[10px] text-white/40">
												Déjà un compte ?{' '}
												<button
													onClick={() =>
														handleSwitchView('login')
													}
													className="text-[#FF6B00] hover:text-[#FF8533] transition-colors duration-200"
												>
													Se connecter
												</button>
											</p>
										</div>
									</motion.div>
								)}

								{view === 'verify' && (
									<motion.div
										key="verify-view"
										custom={direction}
										initial="enter"
										animate="center"
										exit="exit"
										variants={viewVariants}
										transition={{ duration: 0.3, ease: SMOOTH_EASING }}
									>
										{/* Title */}
										<h2 className="font-headline text-xl uppercase tracking-[0.2em] text-white mb-2">
											Vérification
										</h2>

										{/* Subtitle */}
										<p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 mb-8">
											Code envoyé à{' '}
											<span className="text-white/60">
												{pendingVerificationEmail}
											</span>
										</p>

										{/* Verification code inputs */}
										<div className="mb-8">
											<label className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 block mb-4">
												Code (6 chiffres)
											</label>
											<div className="flex gap-2 justify-center">
												{formState.verificationCodes.map(
													(code, index) => (
														<input
															key={index}
															ref={(el) => {
																verificationInputRefs.current[
																	index
																] = el;
															}}
															type="text"
															inputMode="numeric"
															maxLength={1}
															value={code}
															onChange={(e) =>
																handleVerificationCodeChange(
																	index,
																	e.target.value
																)
															}
															onKeyDown={(e) =>
																handleVerificationKeyDown(
																	index,
																	e
																)
															}
															placeholder="-"
															className={cn(
																'w-12 h-14 rounded-sm border',
																'font-mono text-2xl font-bold text-center',
																'bg-white/[0.04]',
																'focus:outline-none transition-all duration-300',
																error
																	? 'border-red-500/50 focus:border-red-500/50'
																	: 'border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/[0.06]'
															)}
														/>
													)
												)}
											</div>
										</div>

										{/* Timer */}
										<div className="mb-6 text-center">
											<p className="font-mono text-[10px] uppercase tracking-[0.15em]">
												<span
													className={
														verifyTimer <= 60
															? 'text-red-500'
															: 'text-white/40'
													}
												>
													Code expire dans {formatTime(verifyTimer)}
												</span>
											</p>
										</div>

										{/* Error */}
										{error && (
											<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
												<p className="font-mono text-[10px] text-red-500/90">
													{error.message}
												</p>
											</div>
										)}

										{/* Submit button */}
										<motion.button
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											onClick={() => handleVerifyEmail()}
											disabled={
												loading ||
												formState.verificationCodes.some(
													(c) => !c
												)
											}
											className={cn(
												'w-full py-3 px-4 rounded-sm font-mono text-sm uppercase tracking-[0.15em]',
												'transition-all duration-300',
												loading ||
													formState.verificationCodes.some(
														(c) => !c
													)
													? 'bg-[#FF6B00]/50 text-white/50 cursor-not-allowed'
													: 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30'
											)}
										>
											{loading ? (
												<div className="flex items-center justify-center">
													<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												</div>
											) : (
												'Vérifier'
											)}
										</motion.button>

										{/* Resend link */}
										<div className="mt-6 text-center">
											<p className="font-mono text-[10px] text-white/40">
												Vous n'avez pas reçu le code ?{' '}
												<button
													onClick={handleResendCode}
													disabled={resendTimer > 0}
													className={cn(
														'transition-colors duration-200',
														resendTimer > 0
															? 'text-white/20 cursor-not-allowed'
															: 'text-[#FF6B00] hover:text-[#FF8533]'
													)}
												>
													{resendTimer > 0
														? `Renvoyer dans ${resendTimer}s`
														: 'Renvoyer le code'}
												</button>
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
