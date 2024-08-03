import Form from '../models/form.js';

const checkFormOwner = async (req, res, next) => {
    const { uuid } = req.params;
    const userId = req.body.user.userId; // Assuming user ID is stored in req.user

    try {
        const form = await Form.findOne({ uuid });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        if (form.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this form' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default checkFormOwner;
