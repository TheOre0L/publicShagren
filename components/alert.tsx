import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import React from 'react';
import { useState } from 'react';
export function AlertCustom({action, message, color = "error", setSuccess}) {
  const [isActive, setIsActive] = useState(action);
  const handleClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
        return;
    }
    setSuccess({action: false, message: '', type: ''})
    setIsActive(false);
};

  return (
    <Snackbar open={isActive} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    // @ts-ignore
                    onClose={handleClose}
                    severity={color}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>

  )
}