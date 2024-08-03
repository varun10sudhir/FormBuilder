import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const FormSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true,default: 'Untitled Form'},
  description: { type: String },
  uuid: { type: String, default: uuidv4, unique: true }, // Add UUID field
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: true });

export default model('Form', FormSchema);
