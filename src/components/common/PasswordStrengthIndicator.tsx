import React from 'react';
import { Check, X } from 'lucide-react';
import { 
  passwordRequirements, 
  getPasswordStrength, 
  getPasswordStrengthClasses,
  doPasswordsMatch 
} from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  confirmPassword?: string;
  showMatch?: boolean;
  className?: string;
}

/**
 * Reusable password strength indicator component
 */
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  confirmPassword,
  showMatch = false,
  className = "",
}) => {
  const passwordStrength = getPasswordStrength(password);
  const strengthClasses = getPasswordStrengthClasses(passwordStrength.level);
  const passwordsMatch = confirmPassword ? doPasswordsMatch(password, confirmPassword) : true;

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthClasses.bar}`}
            style={{ width: `${passwordStrength.percent}%` }}
          />
        </div>
        <span className={`text-xs font-medium capitalize ${strengthClasses.text}`}>
          {passwordStrength.level}
        </span>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <ul className="space-y-1">
          {passwordRequirements.map((req) => {
            const passed = req.test(password);
            return (
              <li key={req.id} className="flex items-center gap-2 text-xs">
                {passed ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={passed ? "text-green-500" : "text-gray-400"}>
                  {req.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Password Match Indicator */}
      {showMatch && confirmPassword && (
        <div className="flex items-center gap-2 text-xs">
          {passwordsMatch ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Passwords match</span>
            </>
          ) : (
            <>
              <X className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-500">Passwords do not match</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;