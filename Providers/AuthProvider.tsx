import { createContext } from "react";

export const AuthContext = createContext({
  session: null,
  isAuthStateLoading: true,
  userData: null,
  isAdmin: false,
} as {
  session: any;
  isAuthStateLoading: boolean;
  userData: {
    id: any;
    email: any;
    can_view: boolean;
    can_add: boolean;
    can_delete: boolean;
    is_approved: boolean;
  } | null;
  isAdmin: boolean;
});
