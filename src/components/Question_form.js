import React, { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import { ExpandMore, Add, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  getForm,
  createForm,
  updateForm,
  addQuestion,
  submitForm,
  getRespondents
} from "./api";
import Popup from "./Popup";
import "./Questionform.css";

const questionTypes = [
  { value: "radio", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "text", label: "Short Answer" },
];

function Question_form() {
  const { formUUID } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState("");
  const [responses, setResponses] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const profile = localStorage.getItem('profile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserId(parsedProfile.user._id);

          let response;
          try {
            response = await getForm(formUUID);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              response = await createForm({
                uuid: formUUID,
                description: "",
                questions: [],
                user: parsedProfile.user._id,
              });
            } else {
              throw error;
            }
          }
          const form = response.data;
          setIsOwner(parsedProfile.user._id === form.user);
          setFormTitle(form.title);
          setFormDescription(form.description);
          setQuestions(form.questions.map(q => ({ ...q, open: false, answer: q.answer || "" })));

          // Fetch form responses if in the Responses tab
          if (tabIndex === 1) {
            const responsesResponse = await getRespondents(formUUID);
            setResponses(responsesResponse.data);
          }
        } else {
          console.error("Profile is not available in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching or creating form data:", error);
      }
    };
    fetchFormData();
  }, [formUUID, tabIndex]);

  const saveFormChanges = useCallback(async () => {
    try {
      await updateForm(formUUID, { title: formTitle, description: formDescription, questions });
    } catch (error) {
      console.error("Error saving form changes:", error);
    }
  }, [formUUID, formTitle, formDescription, questions]);

  const handleFieldUpdate = (updateFn, ...args) => {
    updateFn(...args);
    saveFormChanges();
  };

  const handleAddQuestion = async () => {
    const newQuestion = {
      text: "",
      type: "text",
      options: [""],
      open: true,
      required: false,
      answer: ""
    };
    try {
      const response = await addQuestion(formUUID, newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleQuestionTextChange = (text, index) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleOptionTextChange = (text, qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = text;
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleQuestionTypeChange = (type, index) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleAnswerChange = (answer, index) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = answer;
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleToggleAccordion = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].open = !newQuestions[index].open;
    handleFieldUpdate(setQuestions, newQuestions);
  };

  const handleSubmit = async () => {
    const responses = questions.map((ques) => ({
      question: ques._id,
      answer: ques.answer,
    }));

    try {
      const response = await submitForm(formUUID, { responses, user: { userId } });
      console.log("Form submitted successfully", response.data);
      setShowPopup(true); // Show the popup on successful submission
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const questionsUI = questions.map((ques, i) => (
    <Accordion
      expanded={ques.open}
      className={ques.open ? "add_border" : ""}
      key={i}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        onClick={() => handleToggleAccordion(i)}
      >
        <Typography>{ques.text || "Untitled Question"}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          label={`Question ${i + 1}`}
          value={ques.text}
          onChange={(e) => handleQuestionTextChange(e.target.value, i)}
          fullWidth
          margin="dense"
          disabled={!isOwner}
        />
        <Select
          value={ques.type}
          onChange={(e) => handleQuestionTypeChange(e.target.value, i)}
          fullWidth
          margin="dense"
          disabled={!isOwner}
        >
          {questionTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
        {ques.type === "radio" || ques.type === "checkbox" ? (
          ques.options.map((op, j) => (
            <div key={j}>
              <TextField
                label={`Option ${j + 1}`}
                value={op}
                onChange={(e) => handleOptionTextChange(e.target.value, i, j)}
                fullWidth
                margin="dense"
                disabled={!isOwner}
              />
            </div>
          ))
        ) : null}
        {isOwner && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => handleDeleteQuestion(i)}
          >
            Delete Question
          </Button>
        )}
        {!isOwner && (
          <div>
            {ques.type === "radio" || ques.type === "checkbox" ? (
              <Select
                value={ques.answer}
                onChange={(e) => handleAnswerChange(e.target.value, i)}
                fullWidth
                margin="dense"
              >
                {ques.options.map((op, j) => (
                  <MenuItem key={j} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                label={`Your Answer`}
                value={ques.answer}
                onChange={(e) => handleAnswerChange(e.target.value, i)}
                fullWidth
                margin="dense"
              />
            )}
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  ));

  // Render responses
  const responsesUI = responses.length > 0 ? (
    responses.map((response, i) => (
      <div key={i} className="response-item">
        <Typography variant="h6">User: {response.userEmail}</Typography>
        <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Responses:
        </Typography>
        {response.responses.map((resp, j) => (
          <div key={j}>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              {`Question: ${resp.questionText}`}
            </Typography>
            <Typography variant="body2">
              {`Answer: ${resp.answer}`}
            </Typography>
          </div>
        ))}
      </div>
    ))
  ) : (
    <Typography>No responses yet.</Typography>
  );

  return (
    <div>
      <div className="question_form">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} aria-label="form tabs">
            <Tab label="Questions" />
            {isOwner && <Tab label="Responses" />}
          </Tabs>
        </Box>
        <div className="section">
          {tabIndex === 0 ? (
            <div className="question_form_content">
              <div className="question_title_section">
                <div className="question_form_top">
                  <TextField
                    variant="outlined"
                    label="Form Title"
                    value={formTitle}
                    onChange={(e) => handleFieldUpdate(setFormTitle, e.target.value)}
                    fullWidth
                    margin="dense"
                    disabled={!isOwner}
                  />
                  <TextField
                    variant="outlined"
                    label="Form Description"
                    value={formDescription}
                    onChange={(e) => handleFieldUpdate(setFormDescription, e.target.value)}
                    fullWidth
                    margin="dense"
                    disabled={!isOwner}
                  />
                </div>
              </div>
              {questionsUI}
              {isOwner ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddQuestion}
                  style={{ marginTop: "20px" }}
                  startIcon={<Add />}
                >
                  Add Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: "20px" }}
                >
                  Submit
                </Button>
              )}
            </div>
          ) : (
            <div className="responses_section">
              {responsesUI}
            </div>
          )}
        </div>
      </div>
      <Popup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

export default Question_form;
