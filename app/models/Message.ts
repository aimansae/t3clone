import mongoose, { Schema, Document, models, model } from "mongoose";
export interface MessageType extends Document {
  text: string;
  sender: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const MessageSchema = new Schema<MessageType>({
  text: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
});
export default models.Message ||
  mongoose.model<MessageType>("Message", MessageSchema);
