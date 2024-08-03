import express from 'express';
import {
    createForm,
    getForm,
    updateForm,
    deleteForm,
    addQuestion,
    submitForm,
    getUserForms,
    getRespondents,
    getFormResponses
} from '../controllers/formController.js';
import userAuth from '../middleware/authMiddleware.js';
import checkFormOwner from '../middleware/checkFormOwner.js';

const router = express.Router();

router.post('/', userAuth, createForm);
router.get('/:uuid', userAuth,getForm);
router.put('/:uuid', userAuth, checkFormOwner, updateForm);
router.delete('/:uuid', userAuth, checkFormOwner, deleteForm);
router.post('/:uuid/questions', userAuth, checkFormOwner, addQuestion);
router.post('/:uuid/submit', userAuth, submitForm);
router.get('/', userAuth, getUserForms);
router.get('/:uuid/respondents',userAuth,checkFormOwner, getRespondents);
router.get('/:uuid/responses', userAuth, checkFormOwner, getFormResponses);


export default router;
