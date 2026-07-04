import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export const COMMON_WEAK_PASSWORDS = [
  'password',
  'password123',
  '12345678',
  'qwerty',
  'admin',
  'admin123',
  'welcome',
  'iloveyou',
  'abc123',
  'letmein',
];

interface PasswordRequirementsChecklistProps {
  password: string;
  confirmPassword?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordRequirementsChecklist({
  password,
  confirmPassword,
  onValidationChange,
}: PasswordRequirementsChecklistProps) {
  const hasMinLength = password.length >= 8 && password.length <= 64;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]\{\}\|;:\'",.<>?\/\\~`]/.test(password);
  const noSpaces = password.length > 0 && !password.startsWith(' ') && !password.endsWith(' ');
  const isNotWeak = !COMMON_WEAK_PASSWORDS.includes(password.toLowerCase().trim());

  const passwordsMatch = confirmPassword !== undefined ? password === confirmPassword : true;
  const hasInputConfirm = confirmPassword !== undefined && confirmPassword.length > 0;

  const allValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    noSpaces &&
    isNotWeak &&
    passwordsMatch;

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(allValid);
    }
  }, [allValid, onValidationChange]);

  // Real-time strength calculator
  const getStrength = () => {
    if (!password) return { label: '', color: 'bg-transparent', textClass: '', pct: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]\{\}\|;:\'",.<>?\/\\~`]/.test(password)) score++;
    if (password.length >= 12) score++;

    if (COMMON_WEAK_PASSWORDS.includes(password.toLowerCase().trim())) {
      score = Math.max(1, score - 2);
    }

    if (score <= 1) {
      return { label: 'Weak', color: 'bg-red-500', textClass: 'text-red-500', pct: 25 };
    }
    if (score === 2 || score === 3) {
      return { label: 'Medium', color: 'bg-orange-500', textClass: 'text-orange-500', pct: 50 };
    }
    if (score === 4) {
      return { label: 'Strong', color: 'bg-blue-500', textClass: 'text-blue-500', pct: 75 };
    }
    return { label: 'Excellent', color: 'bg-green-500', textClass: 'text-green-500', pct: 100 };
  };

  const strength = getStrength();

  return (
    <div className="space-y-4 pt-1 pb-2">
      {password && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-textSecondary uppercase tracking-wider">Password Strength</span>
            <span className={`${strength.textClass} font-black uppercase`}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-350 ease-out`}
              style={{ width: `${strength.pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          {hasMinLength ? (
            <Check size={12} className="text-success" />
          ) : (
            <X size={12} className="text-textSecondary/40" />
          )}
          <span className={hasMinLength ? 'text-textPrimary' : 'text-textSecondary/60'}>
            8 to 64 characters
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasUppercase ? (
            <Check size={12} className="text-success" />
          ) : (
            <X size={12} className="text-textSecondary/40" />
          )}
          <span className={hasUppercase ? 'text-textPrimary' : 'text-textSecondary/60'}>
            Contains uppercase letter (A–Z)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasLowercase ? (
            <Check size={12} className="text-success" />
          ) : (
            <X size={12} className="text-textSecondary/40" />
          )}
          <span className={hasLowercase ? 'text-textPrimary' : 'text-textSecondary/60'}>
            Contains lowercase letter (a–z)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check size={12} className="text-success" />
          ) : (
            <X size={12} className="text-textSecondary/40" />
          )}
          <span className={hasNumber ? 'text-textPrimary' : 'text-textSecondary/60'}>
            Contains number (0–9)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasSpecialChar ? (
            <Check size={12} className="text-success" />
          ) : (
            <X size={12} className="text-textSecondary/40" />
          )}
          <span className={hasSpecialChar ? 'text-textPrimary' : 'text-textSecondary/60'}>
            Contains special character (!@#$% etc.)
          </span>
        </div>

        {confirmPassword !== undefined && hasInputConfirm && (
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/40 mt-1.5">
            {passwordsMatch ? (
              <>
                <Check size={12} className="text-success" />
                <span className="text-success font-semibold">Passwords match</span>
              </>
            ) : (
              <>
                <X size={12} className="text-red-500" />
                <span className="text-red-500 font-semibold">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
