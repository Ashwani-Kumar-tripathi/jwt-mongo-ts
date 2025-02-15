import mongoose, { Schema, model } from "mongoose";
// Schema
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {type: String, required: true },
});

const UserModel = mongoose.model("User", schema);

export default UserModel;
