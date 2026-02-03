// https://jsonplaceholder.typicode.com/todos/1

import { call, put } from "redux-saga/effects";
import {
  USER_API_ERROR,
  USER_CONFIRM_CODE,
  USER_LOGIN,
  USER_REGISTER,
  USER_SEND_OTP,
  USER_UPDATE,
  USER_UPDATE_PASSWORD,
  USER_VERIFY_PASSWORD_RESET_OTP,
  USER_RESET_PASSWORD,
  USER_REFRESH,
} from "../Actions/UserAction";
import axios from "@/axiosConfig";
import { TOAST_SHOW } from "../Actions/ToastAction";
import { unAuthorizedHelper } from "@/helpers";

interface IUserAction {
  crudType: string;
  payload: any;
}

export function* UserSaga(action: IUserAction): unknown {
  switch (action.crudType) {
    case USER_LOGIN:
      yield userLogin(action.payload);
      break;
    case USER_REGISTER:
      yield registerUser(action.payload);
      break;
    case USER_SEND_OTP:
      yield generateOTP(action.payload);
      break;
    case USER_CONFIRM_CODE:
      yield confirmOTP(action.payload);
      break;
    case USER_VERIFY_PASSWORD_RESET_OTP:
      yield verifyPasswordResetOTP(action.payload);
      break;
    case USER_RESET_PASSWORD:
      yield resetPassword(action.payload);
      break;
    case USER_UPDATE:
      yield updateUser(action.payload);
      break;
    case USER_UPDATE_PASSWORD:
      yield changePassword(action.payload);
      break;
    case USER_REFRESH:
      yield refreshUser();
      break;
    default:
      yield put({ type: USER_API_ERROR });
      break;
  }
}

export function* userLogin(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/login", payload);
    const responseData = response?.data;
    
    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "Login failed";
      throw new Error(errorMessage);
    }

    const { data, message } = responseData;

    // Validate that data exists and has the required properties
    if (!data) {
      throw new Error("Response data is missing");
    }

    if (!data.userData || !data.accessToken) {
      throw new Error("Invalid response structure: missing userData or accessToken");
    }

    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "Login successful" },
    });
    yield put({
      type: USER_LOGIN,
      payload: { ...data.userData, accessToken: data.accessToken },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "Login failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_LOGIN,
      },
    });
  }
}

export function* registerUser(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/registerUser", payload);
    const responseData = response?.data;
    
    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "Registration failed";
      throw new Error(errorMessage);
    }

    const { data, message } = responseData;

    // Validate that data exists and has the required properties
    if (!data) {
      throw new Error("Response data is missing");
    }

    if (!data.userData || !data.accessToken) {
      throw new Error("Invalid response structure: missing userData or accessToken");
    }

    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "Registration successful" },
    });
    yield put({
      type: USER_REGISTER,
      payload: { ...data.userData, accessToken: data.accessToken },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "Registration failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_REGISTER,
      },
    });
  }
}

export function* generateOTP(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/generateOTP", payload);
    const responseData = response?.data;
    
    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "Failed to send OTP";
      throw new Error(errorMessage);
    }

    const { data, message } = responseData;
    
    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "OTP sent successfully" },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "Failed to send OTP";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_SEND_OTP,
      },
    });
  }
}

export function* confirmOTP(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/confirmOTP", payload);
    const responseData = response?.data;
    
    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "OTP verification failed";
      throw new Error(errorMessage);
    }

    const { data, message } = responseData;

    // Validate that data exists and has the required properties
    if (!data) {
      throw new Error("Response data is missing");
    }

    if (!data.userData || !data.accessToken) {
      throw new Error("Invalid response structure: missing userData or accessToken");
    }

    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "OTP verified successfully" },
    });
    yield put({
      type: USER_LOGIN,
      payload: { ...data.userData, accessToken: data.accessToken },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "OTP verification failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_CONFIRM_CODE,
      },
    });
  }
}

// Verify OTP for password reset (does NOT log user in)
export function* verifyPasswordResetOTP(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/verifyPasswordResetOTP", payload);
    const responseData = response?.data;
    
    if (!responseData || responseData.success === false) {
      const errorMessage = responseData?.message || "OTP verification failed";
      throw new Error(errorMessage);
    }

    yield put({
      type: TOAST_SHOW,
      payload: { message: responseData.message || "OTP verified successfully" },
    });
    
    // Return success without logging in
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: responseData.message,
        actionType: USER_VERIFY_PASSWORD_RESET_OTP,
        success: true, // Indicate success
      },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "OTP verification failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_VERIFY_PASSWORD_RESET_OTP,
      },
    });
  }
}

// Reset password after OTP verification
export function* resetPassword(payload: any): unknown {
  try {
    const response = yield call(axios.post, "user/resetPassword", payload);
    const responseData = response?.data;
    
    if (!responseData || responseData.success === false) {
      const errorMessage = responseData?.message || "Password reset failed";
      throw new Error(errorMessage);
    }

    yield put({
      type: TOAST_SHOW,
      payload: { 
        message: responseData.message || "Password reset successfully",
        severity: "success",
      },
    });
    
    // Return success
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: responseData.message,
        actionType: USER_RESET_PASSWORD,
        success: true,
      },
    });
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message ?? "Password reset failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_RESET_PASSWORD,
      },
    });
  }
}

function* updateUser(payload: any): unknown {
  try {
    const response = yield call(axios.put, "/user/updateUser", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseData = response?.data;

    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "Update failed";
      throw new Error(errorMessage);
    }

    const { message, data } = responseData;

    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "Update successful" },
    });
    yield put({
      type: USER_UPDATE,
      payload: data,
    });
  } catch (e: any) {
    unAuthorizedHelper(e);
    const message = e.response?.data?.message ?? e.message ?? "Update failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_UPDATE,
      },
    });
  }
}

function* refreshUser(): unknown {
  try {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      return;
    }

    // Call refreshToken endpoint to get fresh token from database
    const response = yield call(axios.get, "/user/refreshToken");
    const responseData = response?.data;

    if (!responseData || responseData.success === false) {
      // Silently fail if refresh fails
      return;
    }

    const { data } = responseData;
    if (data?.accessToken) {
      // Compare tokens - only update if different
      if (data.accessToken !== currentToken) {
        // Update localStorage with new token
        localStorage.setItem("token", data.accessToken);
        // Dispatch event to notify useTokenData hook
        window.dispatchEvent(new Event("tokenUpdated"));
        // Update Redux state
        yield put({
          type: USER_UPDATE,
          payload: data,
        });
      }
    }
  } catch (e: any) {
    // Silently fail if refresh fails (user might not be logged in or token expired)
    // Don't show error toast for refresh failures
  }
}

function* changePassword(payload: any): unknown {
  try {
    const response = yield call(axios.put, "/user/changePassword", payload);
    const responseData = response?.data;

    // Check if response has the expected structure
    if (!responseData) {
      throw new Error("Invalid response from server");
    }

    // Check if API returned an error response (success: false)
    if (responseData.success === false) {
      const errorMessage = responseData.message || "Password change failed";
      throw new Error(errorMessage);
    }

    const { message, data } = responseData;

    yield put({
      type: TOAST_SHOW,
      payload: { message: message || "Password changed successfully" },
    });
  } catch (e: any) {
    unAuthorizedHelper(e);
    const message = e.response?.data?.message ?? e.message ?? "Password change failed";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: USER_API_ERROR,
      payload: {
        message: message,
        actionType: USER_UPDATE_PASSWORD,
      },
    });
  }
}
