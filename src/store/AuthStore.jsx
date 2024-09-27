import zustand, { create } from "zustand";
import {createJSONStorage, persist} from 'zustand/middleware'

const useAuthStore = create(persist((set) => ({
    isAuthenticated: false,
    storedToken: null,
    storedUsername: null,
    storedUserId:null,
    storedEmail: null,
    storedRole: null,
    setAuth: (newState) => set((state) => newState),
}),{
    name: 'Authentication-state',
    storage: createJSONStorage(() => localStorage),
}))

export default useAuthStore