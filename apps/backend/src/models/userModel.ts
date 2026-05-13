import mongoose, {
  type HydratedDocument,
  type InferSchemaType,
  model,
} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    image: { type: String, default: "" },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"],
      default: "Not Selected",
    },
    dob: { type: Date, default: null },
    phone: { type: String, default: null },
    googleTokens: {
      access_token: String,
      refresh_token: String,
      scope: String,
      token_type: String,
      expiry_date: Number, // Use Number for the timestamp
    },
    isGoogleLinked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = model("user", userSchema);
export type UserSchema = InferSchemaType<typeof userSchema>;
export type IUser = HydratedDocument<InferSchemaType<typeof userSchema>>;
