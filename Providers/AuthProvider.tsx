import { createContext } from "react";

export const AuthContext = createContext({
  session: null,
  isAuthStateLoading: true,
} as {
  session: any;
  isAuthStateLoading: boolean;
});
