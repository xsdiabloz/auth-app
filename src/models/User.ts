import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: "Role" }],
});

const User = model("User", userSchema);

export default User;
