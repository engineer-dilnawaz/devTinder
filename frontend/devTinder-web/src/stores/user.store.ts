import { create } from "zustand";

import type { User } from "../services/auth/auth.types";

export interface UserStoreType {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
