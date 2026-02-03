import { ReducerAction } from "@/utils/types";
import {
  USER_API_ERROR,
  USER_EMAIL_CHECK,
  USER_INIT,
  USER_LOGIN,
  USER_REGISTER,
  USER_SEND_OTP,
  USER_UPDATE,
  USER_REFRESH,
} from "../Actions/UserAction";
import jwt from "jsonwebtoken";

const userInitialState = {
  email: "",
  name: "",
  mobile: "",
  loading: false,
  error: null as { message: string; actionType: string; success?: boolean } | null,
  actionType: null as string | null,
  success: false,
};

const userReducer = (state = userInitialState, action: ReducerAction) => {
  const { payload } = action;

  switch (action.type) {
    case USER_INIT:
      return {
        ...state,
        ...(action.crudType !== USER_SEND_OTP && { loading: true }),
      };

    case USER_LOGIN:
      localStorage.setItem("token", payload.accessToken);
      return {
        ...state,
        email: payload.email,
        name: payload.name,
        loading: false,
        error: null,
        actionType: null,
        success: false,
      };
    case USER_REGISTER:
      localStorage.setItem("token", payload.accessToken);
      return {
        ...state,
        email: payload.email,
        name: payload.name,
        loading: false,
        error: null,
        actionType: null,
        success: false,
      };
    case USER_UPDATE:
      if (payload?.accessToken) {
        localStorage.setItem("token", payload.accessToken);
        // Decode token to get updated user data
        let updatedTokenData = payload.userData || payload;
        // If userData is not in payload, decode from token
        if (!updatedTokenData || (!updatedTokenData.email && !updatedTokenData.name)) {
          try {
            const decoded = jwt.decode(payload.accessToken) as any;
            if (decoded) {
              updatedTokenData = decoded;
            }
          } catch (error) {
            console.error("Error decoding token in USER_UPDATE:", error);
          }
        }
        // Dispatch custom event to notify useTokenData hook
        window.dispatchEvent(new Event("tokenUpdated"));
        return {
          ...state,
          email: updatedTokenData?.email || state.email,
          name: updatedTokenData?.name || state.name,
          mobile: updatedTokenData?.mobile || state.mobile,
        };
      }
      return { ...state };

    case USER_EMAIL_CHECK:
      return {
        ...state,
        email: payload.email,
        mobile: payload.mobile,
        loading: false,
        error: null,
      };
    case USER_API_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || null,
        actionType: action.payload?.actionType || null,
        success: action.payload?.success || false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
