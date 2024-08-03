// FormLinkPopup.js
import React from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';
import styled from '@emotion/styled';

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
}));

const FormLinkPopup = ({ open, handleClose, formLink }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(formLink);
    alert('Link copied to clipboard!');
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={6000}
      onClick={handleClose}
    >
      <StyledSnackbarContent
        message={formLink}
        action={
          <IconButton onClick={handleCopyClick}>
            <FileCopyIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default FormLinkPopup;
