import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import form_image from "../images/form_image.png";
import { FiStar, FiSettings } from 'react-icons/fi';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Avatar, IconButton, Button } from '@mui/material';
import { IoMdFolderOpen } from 'react-icons/io';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { AiOutlineEye } from 'react-icons/ai';
import "./Formheader.css";
import { getForm } from './api'; // Import the API function to fetch form data
import FormLinkPopup from './FormLinkPopup'; // Import the popup component

function FormHeader() {
  const { formUUID } = useParams();
  const [doc, setDoc] = useState({ name: "Untitled form" });
  const [popupOpen, setPopupOpen] = useState(false);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await getForm(formUUID);
        const form = response.data;
        setDoc({ ...doc, name: form.title || "Untitled form" });
        setFormLink(`http://example.com/forms/${formUUID}`); // Replace with your form link format
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    
    fetchFormData();
  }, [formUUID]);

  const handleNameChange = (e) => {
    setDoc({ ...doc, name: e.target.value });
    // Optionally add an API call here to update the form title in the backend
  };

  const handleSendClick = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <div className="form_header">
      <div className="form_header_left">
        <img src={form_image} style={{ height: "45px", width: "40px" }} alt="form" />
        <input
          type="text"
          placeholder="Untitled form"
          className="form_name"
          value={doc.name}
          onChange={handleNameChange}
        />
        <IoMdFolderOpen className="form_header_icon" style={{ marginRight: "10px" }} />
        <FiStar style={{ marginRight: "10px" }} />
        <span style={{ fontSize: "12px", fontWeight: "600" }}>All changes saved in Drive</span>
      </div>
      <div className="form_header_right">
        <IconButton>
          <ColorLensIcon size="small" className="form_header_icon" />
        </IconButton>
        <IconButton>
          <AiOutlineEye className="form_header_icon" />
        </IconButton>
        <IconButton>
          <FiSettings className="form_header_icon" />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handleSendClick}>Send</Button>
        <IconButton>
          <DragIndicatorIcon className="form_header_icon" />
        </IconButton>
        <Avatar style={{ height: "30px", width: "30px" }} src="avatarimage_url" />
      </div>
      <FormLinkPopup open={popupOpen} handleClose={handlePopupClose} formLink={formLink} />
    </div>
  );
}

export default FormHeader;
