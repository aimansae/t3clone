import { models, Schema } from "mongoose";
import mongoose from "mongoose";

export interface UserType extends Document {
  name: string;
  email: string;
  image?: string;
}

const UserSchema = new Schema<UserType>({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
});
export default models.User || mongoose.model<UserType>("User", UserSchema);
