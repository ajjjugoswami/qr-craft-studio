// Password validation requirements
export const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
  { id: "number", label: "Contains a number", test: (pwd: string) => /\d/.test(pwd) },
  { id: "lowercase", label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
  { id: "uppercase", label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: "symbol", label: "Contains a symbol", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~;']/.test(pwd) },
];

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  percent: number;
  score: number;
  passedRequirements: string[];
}

/**
 * Calculate password strength based on requirements
 * @param password - The password to validate
 * @returns Password strength information
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  const passedRequirements = passwordRequirements
    .filter((req) => req.test(password))
    .map((req) => req.id);
  
  const score = passedRequirements.length;
  
  let level: PasswordStrengthLevel;
  let percent: number;
  
  if (score === 0 || score === 1) {
    level = "weak";
    percent = score === 0 ? 0 : 33;
  } else if (score === 2 || score === 3) {
    level = "medium";
    percent = 66;
  } else {
    level = "strong";
    percent = 100;
  }
  
  return {
    level,
    percent,
    score,
    passedRequirements,
  };
};

/**
 * Check if password meets all requirements
 * @param password - The password to validate
 * @returns True if all requirements are met
 */
export const isPasswordStrong = (password: string): boolean => {
  return passwordRequirements.every((req) => req.test(password));
};

/**
 * Get failed password requirements
 * @param password - The password to validate
 * @returns Array of failed requirement objects
 */
export const getFailedRequirements = (password: string) => {
  return passwordRequirements.filter((req) => !req.test(password));
};

/**
 * Get password strength color for UI
 * @param level - Password strength level
 * @returns CSS color class or hex color
 */
export const getPasswordStrengthColor = (level: PasswordStrengthLevel) => {
  switch (level) {
    case "weak":
      return "#ef4444"; // red-500
    case "medium":
      return "#eab308"; // yellow-500
    case "strong":
      return "#22c55e"; // green-500
    default:
      return "#6b7280"; // gray-500
  }
};

/**
 * Get password strength CSS classes for Tailwind
 * @param level - Password strength level
 * @returns Object with CSS classes
 */
export const getPasswordStrengthClasses = (level: PasswordStrengthLevel) => {
  switch (level) {
    case "weak":
      return {
        bar: "bg-red-500",
        text: "text-red-500",
      };
    case "medium":
      return {
        bar: "bg-yellow-500", 
        text: "text-yellow-500",
      };
    case "strong":
      return {
        bar: "bg-green-500",
        text: "text-green-500",
      };
    default:
      return {
        bar: "bg-gray-500",
        text: "text-gray-500",
      };
  }
};

/**
 * Validate password match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns True if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Get comprehensive password validation result
 * @param password - Password to validate
 * @param confirmPassword - Optional confirmation password
 * @returns Complete validation result
 */
export const validatePassword = (password: string, confirmPassword?: string) => {
  const strength = getPasswordStrength(password);
  const isStrong = isPasswordStrong(password);
  const failedRequirements = getFailedRequirements(password);
  const passwordsMatch = confirmPassword ? doPasswordsMatch(password, confirmPassword) : true;
  
  return {
    strength,
    isStrong,
    isValid: isStrong && passwordsMatch,
    failedRequirements,
    passwordsMatch,
    errors: [
      ...(!isStrong ? ["Password does not meet all requirements"] : []),
      ...(!passwordsMatch ? ["Passwords do not match"] : []),
    ],
  };
};