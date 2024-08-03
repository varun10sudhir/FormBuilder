import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StorageIcon from '@mui/icons-material/Storage';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import docs from "../images/forms_doc.png";
import './Mainbody.css';
import { getUserForms } from './api';

function Mainbody() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Retrieve and parse the profile from localStorage
        const profileString = localStorage.getItem('profile');
        const profile = profileString ? JSON.parse(profileString) : null;
        const userid = profile.user._id
        // Check if profile and token exist
        const token = profile ? profile.token : '';

        const response = await getUserForms();
        console.log(response)
        if (response.data) {
          setForms(response.data);
        } else {
          console.error('Failed to fetch forms');
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="mainbody">
      <div className="mainbody_top">
        <div className="mainbody_top_left" style={{ fontSize: "16px", fontWeight: "500" }}>
          Recent forms
        </div>
        <div className="mainbody_top_right">
          <div className="mainbody_top_center" style={{ fontSize: "14px", marginRight: "125px" }}>
            Owned by anyone <ArrowDropDownIcon />
          </div>
          <IconButton>
            <StorageIcon style={{ fontSize: '16px', color: "black" }} />
          </IconButton>
          <IconButton>
            <FolderOpenIcon style={{ fontSize: '16px', color: "black" }} />
          </IconButton>
        </div>
      </div>
      <div className="mainbody_docs">
        {forms.length > 0 ? (
          forms.map(form => (
            <div className="doc_card" key={form.uuid}>
              <Link to={`/forms/${form.uuid}`}>
                <img src={docs} alt="Document" className="doc_image" />
              </Link>
              <div className="doc_card_content">
                <h5>{form.title}</h5>
                <div className="doc_content" style={{ fontSize: "12px", color: "grey" }}>
                  <div className="content_left">
                    <StorageIcon style={{ color: "white", fontSize: "12px", padding: "3px", marginRight: "3px", backgroundColor: "#6E2594", borderRadius: "2px" }} />
                  </div>
                  <DragIndicatorIcon style={{ fontSize: "12px", color: "grey" }} />
                  <div className="content_right">
                    {/* Additional content if needed */}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No forms found</p>
        )}
      </div>
    </div>
  );
}

export default Mainbody;
