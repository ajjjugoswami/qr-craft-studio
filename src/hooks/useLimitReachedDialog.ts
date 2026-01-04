import { useState, useCallback } from 'react';

interface LimitErrorData {
  success: boolean;
  message: string;
  upgradeRequired: boolean;
  currentPlan: string;
  currentCount: number;
  maxAllowed: number;
}

export const useLimitReachedDialog = () => {
  const [open, setOpen] = useState(false);
  const [limitData, setLimitData] = useState<LimitErrorData | null>(null);

  const showLimitDialog = useCallback((errorData: LimitErrorData) => {
    setLimitData(errorData);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setLimitData(null);
  }, []);

  // Check if an error response indicates a limit reached error
  const isLimitError = useCallback((error: any): LimitErrorData | null => {
    const errorData = error?.response?.data;
    if (
      errorData &&
      errorData.success === false &&
      errorData.upgradeRequired === true &&
      errorData.currentPlan &&
      typeof errorData.currentCount === 'number' &&
      typeof errorData.maxAllowed === 'number'
    ) {
      return errorData as LimitErrorData;
    }
    return null;
  }, []);

  return {
    open,
    limitData,
    showLimitDialog,
    handleClose,
    isLimitError,
  };
};

export default useLimitReachedDialog;