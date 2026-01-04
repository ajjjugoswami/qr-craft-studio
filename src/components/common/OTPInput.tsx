import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from 'antd';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  value = '',
  disabled = false,
  loading = false
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split('').slice(0, length).concat(Array(Math.max(0, length - value.length)).fill(''))
  );
  const inputRefs = useRef<(any)[]>([]);

  React.useEffect(() => {
    const newOtp = value.split('').slice(0, length).concat(Array(Math.max(0, length - value.length)).fill(''));
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Move to next input if value entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all fields filled
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      onChange?.(newOtp.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    
    if (pastedData) {
      const newOtp = pastedData.split('').concat(Array(Math.max(0, length - pastedData.length)).fill(''));
      setOtp(newOtp);
      onChange?.(pastedData);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex, pastedData.length);
      inputRefs.current[focusIndex]?.focus();

      if (pastedData.length === length) {
        onComplete?.(pastedData);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled || loading}
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg"
          style={{
            textAlign: 'center',
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;