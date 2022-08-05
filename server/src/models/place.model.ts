import { IPlace } from "@interfaces/place.interface";
import { Schema, Types, model } from "mongoose";

const placeSchema = new Schema<IPlace>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  creator: { type: Types.ObjectId, required: true, ref: "User" },
});

placeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

placeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

export const Place = model("Place", placeSchema);
