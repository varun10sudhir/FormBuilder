import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Create styled components with the new MUI styling approach
const StyledPaper = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontSize: 12,
  color: "#5f6368",
  textTransform: "capitalize",
  height: 10,
  fontWeight: "600",
  fontFamily: "Google Sans, Roboto, Arial, sans-serif",
}));

const CenteredTabs = () => {
  return (
    <StyledPaper>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        <StyledTab label="Questions" />
        <StyledTab label="Responses" />
      </Tabs>
    </StyledPaper>
  );
}

export default CenteredTabs;
