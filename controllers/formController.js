import Form from '../models/form.js';
import Question from '../models/question.js';
import { v4 as uuidv4 } from 'uuid'; // Import UUID function
import Response from '../models/response.js';
import User from '../models/user.js';

// Create a new form
export const createForm = async (req, res) => {
    console.log(req);
    const { uuid,description,user} = req.body;
    console.log(user);
    console.log("Creating a new form")
    try {
        // Generate a UUID for the form
        const form = new Form({
            description,
            user:user.userId,
            uuid: uuid // Add UUID here
        });

        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a form by UUID
export const getForm = async (req, res) => {
    try {
        console.log(req);
        const form = await Form.findOne({ uuid: req.params.uuid }).populate('questions');
        console.log(form);
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a form by UUID
// Update a form by UUID
export const updateForm = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Find the form by UUID
        const form = await Form.findOne({ uuid: req.params.uuid });
        if (!form) return res.status(404).json({ error: 'Form not found' });

        // Update form title and description
        form.title = title;
        form.description = description;

        // Update each question
        for (const questionData of questions) {
            if (questionData._id) {
                // Update existing question
                await Question.findByIdAndUpdate(questionData._id, questionData);
            } else {
                // Add new question
                const newQuestion = new Question({
                    form: form._id,
                    ...questionData,
                });
                await newQuestion.save();
                form.questions.push(newQuestion._id);
            }
        }

        // Save the updated form
        await form.save();

        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a form by UUID
export const deleteForm = async (req, res) => {
    try {
        const form = await Form.findOneAndDelete({ uuid: req.params.uuid });
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add a question to a form
export const addQuestion = async (req, res) => {
    const { uuid } = req.params;
    const { text, type, options } = req.body;

    try {
        const form = await Form.findOne({ uuid });
        if (!form) return res.status(404).json({ error: 'Form not found' });

        const question = new Question({
            form: form.uuid,
            text,
            type,
            options
        });

        await question.save();
        form.questions.push(question._id);
        await form.save();

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const submitForm = async (req, res) => {
    const { uuid } = req.params; // Form UUID
    const { responses, user } = req.body; // Array of responses and user info
    try {
      const form = await Form.findOne({ uuid });
      if (!form) return res.status(404).json({ error: 'Form not found' });
  
      // Check if the user has already submitted a response to this form
      let submission = await Response.findOne({ form: form._id, user: user.userId });
  
      if (submission) {
        // If submission exists, update it
        submission.responses = responses;
      } else {
        // If submission does not exist, create a new one
        submission = new Response({
          form: form._id,
          user: user.userId, // Optional user ID if logged in
          responses
        });
      }
      await submission.save();
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

export const getUserForms = async (req, res) => {
    console.log(req.headers) // Assuming user ID is stored in req.user)
    try {
        // Find all forms created by the user
        const forms = await Form.find({ user: req.headers.userid });
        console.log(forms)
        if (!forms.length) {
            return res.status(200).json({ message: 'No forms found' });
        }
        res.status(200).json(forms);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getRespondents = async (req, res) => {
    const { uuid } = req.params;

    try {
        // Find the form by UUID
        const form = await Form.findOne({ uuid }).populate('questions');
        if (!form) return res.status(404).json({ error: 'Form not found' });

        // Find responses for the form
        const responses = await Response.find({ form: form._id });
        if (!responses || responses.length === 0) {
            return res.status(404).json({ error: 'No responses found' });
        }

        // Format the response data
        const formattedResponses = await Promise.all(responses.map(async response => {
            const user = response.user ? await User.findById(response.user).select('email') : null;
            const userEmail = user ? user.email : 'Anonymous';

            const formattedResponse = {
                userEmail,
                responses: await Promise.all(response.responses.map(async r => {
                    const question = r.question ? await Question.findById(r.question).select('text') : null;
                    const questionText = question ? question.text : 'Unknown Question';
                    return {
                        questionText,
                        answer: r.answer
                    };
                }))
            };
            return formattedResponse;
        }));

        res.status(200).json(formattedResponses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get detailed responses for a form by UUID
export const getFormResponses = async (req, res) => {
    const { uuid } = req.params;

    try {
        // Find the form by UUID
        const form = await Form.findOne({ uuid });
        if (!form) return res.status(404).json({ error: 'Form not found' });

        // Find responses for the form and populate user and question details
        const responses = await Response.find({ form: form._id })
                                        .populate('user', 'username email')
                                        .populate('responses.question', 'text type');

        res.status(200).json(responses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
