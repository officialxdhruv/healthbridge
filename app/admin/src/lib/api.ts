import ky from "ky";

export const api = ky.create({
  prefix: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  credentials: "include",
});
