export type LoginPayload = {
  emailId: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  authToken: string;
};
