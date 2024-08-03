import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
    form: { type: String, ref: 'Form', required: true },
    text: { type: String},
    type: { type: String, enum: ['text', 'multiple-choice', 'checkbox'], required: true },
    options: [String],
    required: { type: Boolean, default: false },
}, { timestamps: true });

export default model('Question', QuestionSchema);
