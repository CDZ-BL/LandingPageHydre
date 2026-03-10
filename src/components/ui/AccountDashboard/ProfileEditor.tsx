'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ProfileEditorProps {
  displayName: string | null;
  email: string;
  onUpdate: () => void;
}

export const ProfileEditor = ({ displayName, email, onUpdate }: ProfileEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayName ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSubmit = async () => {
    setMessage(null);

    // Validation
    if (showPasswordFields) {
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Mot de passe actuel requis' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
        return;
      }
      if (newPassword.length < 8) {
        setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
        return;
      }
    }

    const hasNameChange = name !== (displayName ?? '');
    const hasPasswordChange = showPasswordFields && newPassword.length > 0;

    if (!hasNameChange && !hasPasswordChange) {
      setMessage({ type: 'error', text: 'Aucune modification détectée' });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('hydre_auth_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Session expirée, reconnectez-vous' });
        return;
      }

      const payload: Record<string, string> = {};
      if (hasNameChange) payload.displayName = name;
      if (hasPasswordChange) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Erreur lors de la mise à jour' });
        return;
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
      onUpdate();

      // Close editor after success
      setTimeout(() => {
        setIsEditing(false);
        setMessage(null);
      }, 1500);
    } catch {
      setMessage({ type: 'error', text: 'Erreur réseau' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = cn(
    'w-full px-3 py-2.5 font-mono text-sm text-white/80',
    'bg-white/[0.03] border border-white/[0.1] rounded',
    'focus:outline-none focus:border-[#FF6B00]/50',
    'placeholder:text-white/25',
    'transition-colors duration-300'
  );

  const labelClasses = 'text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1.5 block';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        'border border-white/[0.08] rounded-lg',
        'bg-white/[0.02] backdrop-blur',
        'p-6'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase">
          Informations
        </h3>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setMessage(null);
            setShowPasswordFields(false);
          }}
          className={cn(
            'font-mono text-[10px] tracking-[0.15em] uppercase',
            'px-3 py-1.5 border rounded',
            'transition-all duration-300',
            isEditing
              ? 'border-white/20 text-white/50 hover:text-white/70'
              : 'border-[#FF6B00]/30 text-[#FF6B00]/70 hover:text-[#FF6B00]'
          )}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {/* Read-only view */}
      {!isEditing && (
        <div className="space-y-4">
          <div>
            <p className={labelClasses}>Nom d&apos;affichage</p>
            <p className="font-mono text-sm text-white/70">
              {displayName || <span className="text-white/25 italic">Non défini</span>}
            </p>
          </div>
          <div>
            <p className={labelClasses}>Email</p>
            <p className="font-mono text-sm text-white/70">{email}</p>
          </div>
        </div>
      )}

      {/* Edit view */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Display Name */}
            <div>
              <label className={labelClasses}>Nom d&apos;affichage</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className={inputClasses}
                maxLength={50}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className={labelClasses}>Email</label>
              <input
                type="email"
                value={email}
                disabled
                className={cn(inputClasses, 'opacity-40 cursor-not-allowed')}
              />
              <p className="text-[10px] font-mono text-white/25 mt-1">
                L&apos;email ne peut pas être modifié
              </p>
            </div>

            {/* Password toggle */}
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="font-mono text-[10px] tracking-[0.1em] text-[#FF6B00]/60 hover:text-[#FF6B00] transition-colors duration-300 uppercase"
            >
              {showPasswordFields ? '— Masquer' : '+ Changer le mot de passe'}
            </button>

            {/* Password fields */}
            <AnimatePresence>
              {showPasswordFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={labelClasses}>Mot de passe actuel</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={inputClasses}
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClasses}
                      autoComplete="new-password"
                      placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClasses}
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message */}
            {message && (
              <p
                className={cn(
                  'text-[11px] font-mono tracking-[0.05em]',
                  message.type === 'success' ? 'text-green-400' : 'text-red-400'
                )}
              >
                {message.text}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                'w-full py-3 font-mono text-[11px] tracking-[0.2em] uppercase',
                'border rounded',
                'transition-all duration-300',
                isLoading
                  ? 'border-white/10 text-white/30 cursor-wait'
                  : 'border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]/60'
              )}
            >
              {isLoading ? 'Mise à jour...' : 'Sauvegarder'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
