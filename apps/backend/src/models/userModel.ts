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
    isGoogleLinked: { type: Boolean, default: false },
    googleTokens: {
      access_token: { type: String, select: false },   // never return in queries
      refresh_token: { type: String, select: false },  // sensitive data
      expiry_date: { type: Number, select: false },
    },
  },
  { timestamps: true },
)

export const User = model("user", userSchema);
export type UserSchema = InferSchemaType<typeof userSchema>;
export type IUser = HydratedDocument<InferSchemaType<typeof userSchema>>;
