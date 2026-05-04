export type AppointmentUserData = {
  name: string;
  email: string;
  phone?: string;
  image?: string;
};

export type AppointmentDocData = {
  name: string;
  email: string;
  speciality?: string;
  image?: string;
};

export type Appointment = {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  userData: AppointmentUserData;
  docData: AppointmentDocData;
  amount: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
