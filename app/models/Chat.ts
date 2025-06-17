import mongoose, { Schema, Document, models, model } from 'mongoose';
export interface Message {
  text: string;
  role: 'user' | 'ai';
  timestamp?: Date;
}

export interface ChatDocument extends Document {
  userId: string;
  title?: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}
const MessageSchema = new Schema<Message>(
  {
    text: { type: String, required: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ChatSchema = new Schema<ChatDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true },
);
export default models.Chat || model<ChatDocument>('Chat', ChatSchema);
