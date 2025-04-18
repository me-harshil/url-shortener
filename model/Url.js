import { Schema, model } from "mongoose";

const urlSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Url = model("Url", urlSchema);

export default Url;
