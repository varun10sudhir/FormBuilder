import React from 'react';
import "./Header.css";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import { Avatar, IconButton } from '@mui/material';
import forms_image from "../images/forms_icon.png";

function Header() {
    return (
        <div className="header">
            <div className="header_info">
                <IconButton>
                    <MenuIcon />
                </IconButton>
            </div>
            <div className="header_search">
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input type="text" name="search" placeholder="Search forms" />
            </div>
            <div className="header_right">
                <IconButton>
                    <AppsIcon />
                </IconButton>
                <IconButton>
                    <Avatar />
                </IconButton>
            </div>
        </div>
    );
}

export default Header;
