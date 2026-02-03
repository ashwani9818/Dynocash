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
    case USER_UPDATE:
      yield updateUser(action.payload);
      break;
    case USER_UPDATE_PASSWORD:
      yield changePassword(action.payload);
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
