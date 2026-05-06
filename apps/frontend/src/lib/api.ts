import ky from "ky";
import { useAppStore } from "@/state/useAppStore";

export const api = ky.extend({
  baseUrl: useAppStore.getState().backendUrl + "/api/v1/",
  credentials: "include",
});

export const mlApi = ky.create({
  baseUrl: "http://127.0.0.1:8000",
});
