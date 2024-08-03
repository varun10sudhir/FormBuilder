import React, { useEffect } from "react";
import { Modal, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Popup({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Automatically navigate after 3 seconds
      const timer = setTimeout(() => {
        navigate("/forms");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, navigate]);

  return (
    <Modal open={open} onClose={onClose}>
      <div style={styles.modal}>
        <Typography variant="h6" component="h2">
          Form Submitted Successfully!
        </Typography>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          You will be redirected to the forms page shortly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          onClick={() => navigate("/forms")}
        >
          Go to Forms
        </Button>
      </div>
    </Modal>
  );
}

const styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  },
};

export default Popup;
