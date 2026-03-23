import { model, Schema } from "mongoose";

const roleSchema = new Schema({
  value: { type: String, unique: true, default: "USER" },
});

const Role = model("Role", roleSchema);

export default Role;
