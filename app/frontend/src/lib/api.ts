import { useAppStore } from "@/state/useAppStore";
import ky from "ky";

export const api = ky.extend({
  baseUrl: useAppStore.getState().backendUrl + "/api/v1/",
  credentials: "include",
});
