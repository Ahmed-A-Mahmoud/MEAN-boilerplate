import { IUser } from "@interfaces/user.interface";
import { model, Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  places: [{ type: Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

userSchema.plugin(uniqueValidator);

export const User = model<IUser>("User", userSchema);
