import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectLimitError, selectShowLimitDialog, hideLimitDialog } from '@/store/slices/qrCodesSlice';
import LimitReachedDialog from './LimitReachedDialog';

const GlobalLimitReachedDialog: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const limitError = useAppSelector(selectLimitError);
  const showDialog = useAppSelector(selectShowLimitDialog);

  const handleClose = () => {
    dispatch(hideLimitDialog());
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <LimitReachedDialog
      open={showDialog}
      onClose={handleClose}
      onNavigate={handleNavigate}
      limitData={limitError}
    />
  );
};

export default GlobalLimitReachedDialog;