// @mui
import { DialogProps } from '@mui/material';

export interface ConfirmDialogProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}

