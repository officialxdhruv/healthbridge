export type Doctor = {
  _id: string;
  name: string;
  email: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  available: boolean;
  fees: number;
  address: {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
  };
  slotsBooked: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
};
