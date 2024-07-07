import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IUserState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  //   type: string;
  token: string;
}

export interface IHotelStore {
  user: IUserState | null;
  login: (user: IUserState) => void;
  logout: () => void;
}

const useHotelStore = create<IHotelStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: (user) => set({ user }),
        logout: () => set((state) => ({ ...state, user: null })),
      }),
      { name: "bearStore" }
    )
  )
);

export { useHotelStore };
