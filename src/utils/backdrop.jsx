// src/components/BackdropModal.jsx
import React from "react";
import { Backdrop, Fade, Box } from "@mui/material";

const BackdropModal = ({ open, onClose, children }) => {
  return (
    <Backdrop
      open={open}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      onClick={onClose}
    >
      <Fade in={open}>
        <Box
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 w-[400px]"
        >
          {children}
        </Box>
      </Fade>
    </Backdrop>
  );
};

export default BackdropModal;
