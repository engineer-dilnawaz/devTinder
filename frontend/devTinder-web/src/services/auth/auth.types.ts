export type LoginPayload = {
  emailId: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  authToken: string;
  user: User;
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  bio: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  profilePhoto: string;
  age: number;
  gender: string;
}
