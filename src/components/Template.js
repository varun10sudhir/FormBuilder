import React from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'; // Use an alternative icon
import { IconButton } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import "./Template.css";
import blank from "../images/forms-blank-googlecolors.png";
import party from "../images/forms_rsvp.png";
import contact from "../images/forms_contact.png";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";

function Template() {
    const navigate = useNavigate();
    const createForm = () => {
        const id = uuid();
        navigate("/forms/" + id);
    };
    return (
        <div className="template_section">
            <div className="template_top">
                <div className="template_left">
                    <span style={{ fontSize: "16px", color: "#202124" }}>Start New Form</span>
                </div>
                <div className="template_right">
                    <div className="gallery_button">
                        Template gallery
                        <UnfoldMoreIcon fontSize='small' />
                    </div>
                    <IconButton>
                        <DragIndicatorIcon fontSize='small' />
                    </IconButton>
                </div>
            </div>
            <div className="template_body">
                <div className="card" onClick={createForm}>
                    <img src={blank} alt="Blank Form" />
                    <p className="card_title">Blank</p>
                </div>
                <div className="card">
                    <img src={party} alt="Party Form" />
                    <p className="card_title">Party</p>
                </div>
                <div className="card">
                    <img src={contact} alt="Contact Info Form" />
                    <p className="card_title">Contact Info</p>
                </div>
            </div>
        </div>
    );
}

export default Template;
