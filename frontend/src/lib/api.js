import { axiosInstance } from "./axios";

export const signup = async (signUpData) => {
      const res = await axiosInstance.post("/auth/signup", signUpData);
      return res.data;
}

export const getAuthUser = async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    }

export const completeOnboarding = async (userData) => {
      const res = await axiosInstance.post("/auth/onboarding", userData);
      return res.data;
}