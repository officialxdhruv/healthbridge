export type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string | null;
  gender: "Male" | "Female" | "Other" | "Not Selected";
  dob: Date | null;
  address: {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
