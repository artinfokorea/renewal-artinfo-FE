import { apiRequest } from ".";

interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export const signUp = async (payload: SignUpPayload) => {
  const response = await apiRequest.post("/auths/sign-up", payload);
  return response;
};
