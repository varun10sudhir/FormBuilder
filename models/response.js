import { Schema, model } from 'mongoose';

const ResponseSchema = new Schema({
    form: { type: String, ref: 'Form', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, if users are logged in
    responses: [{
        question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: Schema.Types.Mixed, // The answer can be text, choice, etc.
    }],
}, { timestamps: true });

export default model('Response', ResponseSchema);
