import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Template from "./components/Template";
import Mainbody from "./components/Mainbody";
import Formheader from "./components/Formheader";
import CenteredTabs from './components/Tabs';
import Question_form from './components/Question_form';
import Login from './components/Login'; // Moved this import statement here
import Register from './components/SignUp';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/forms/:formUUID" element={
            <>
              <Formheader />
              <Question_form />
            </>
          } />
          <Route path="/forms" element={
            <>
              <Header />
              <Template />
              <Mainbody />
            </>
          } />
          <Route path="/login" element={
            <Login />
          } />
          <Route path="/signup" element={
            <Register />
          } />
           <Route path="/" element={
            <Home />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
