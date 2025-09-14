import { axiosInstance } from "./axios";

export const signup = async (signUpData) => {
      const res = await axiosInstance.post("/auth/signup", signUpData);
      return res.data;
}