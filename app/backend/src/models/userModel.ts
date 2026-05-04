import mongoose, {
  type HydratedDocument,
  type InferSchemaType,
  model,
} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // never return in queries
    image: { type: String, default: "" }, // URL not base64
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"], // constrain valid values
      default: "Not Selected",
    },
    dob: { type: Date, default: null }, // Date instead of String
    phone: { type: String, default: null }, // null instead of "0000000000"
  },
  { timestamps: true },
);

export const User = model("user", userSchema);
export type UserSchema = InferSchemaType<typeof userSchema>;
export type IUser = HydratedDocument<InferSchemaType<typeof userSchema>>;
