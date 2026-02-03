import { call, put } from "redux-saga/effects";

import axios from "@/axiosConfig";
import { TOAST_SHOW } from "../Actions/ToastAction";
import { WALLET_API_ERROR, WALLET_FETCH, WALLET_ADD_ADDRESS, VERIFY_OTP } from "../Actions/WalletAction";
interface IWalletAction {
  crudType: string;
  payload: any;
}

export function* WalletSaga(action: IWalletAction): unknown {
  switch (action.crudType) {
    case WALLET_FETCH:
      yield getWallet();
      break;

    case WALLET_ADD_ADDRESS:
      yield validateWalletAddress(action.payload);
      break;

    default:
      yield put({ type: WALLET_API_ERROR });
      break;
  }
}

export function* getWallet(): unknown {
  try {
    const {
      data: { data, message },
    } = yield call(axios.get, "wallet/getWallet");

    yield put({
      type: WALLET_FETCH,
      payload: data,
    });
  } catch (e: any) {
    const message = e?.response?.data?.message ?? e?.message ?? "Failed to fetch wallets";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: WALLET_API_ERROR,
    });
  }
}

export function* validateWalletAddress(payload: any): unknown {
  try {
    console.log("Sending payload:", payload);
    const {
      data: { data, message },
    } = yield call(
      axios.post,
      "wallet/validateWalletAddress",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    yield put({
      type: TOAST_SHOW,
      payload: { message },
    });
    yield put({
      type: WALLET_ADD_ADDRESS,
      payload: data,
    });
  } catch (e: any) {
    const message = e?.response?.data?.message ?? e?.message ?? "Failed to validate wallet address";
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: WALLET_API_ERROR,
    });
  }
}

export async function verifyOtp(payload: any): Promise<{ status: boolean; message: string }> {
  try {

    console.log("Verifying OTP with payload:", payload);

    const response = await axios.post(
      "/wallet/verifyCode",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const httpStatus = response.status; 
    const { data, message, success } = response.data;

    // Dispatch VERIFY_OTP action
    return { status:httpStatus === 200,message };
  } catch (e: any) {
    const message =
      e.response?.data?.message ?? e.message ?? "OTP verification failed";

    return {status:false,message};
  }
}
