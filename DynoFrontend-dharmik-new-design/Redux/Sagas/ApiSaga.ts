import { call, put } from "redux-saga/effects";

import axios from "@/axiosConfig";
import { TOAST_SHOW } from "../Actions/ToastAction";
import {
  API_ERROR,
  API_DELETE,
  API_FETCH,
  API_INSERT,
} from "../Actions/ApiAction";

interface IApiAction {
  crudType: string;
  payload: any;
}

export function* ApiSaga(action: IApiAction): unknown {
  switch (action.crudType) {
    case API_INSERT:
      yield addApi(action.payload);
      break;

    case API_FETCH:
      yield getApi();
      break;

    case API_DELETE:
      yield deleteApi(action.payload);
      break;

    default:
      yield put({ type: API_ERROR });
      break;
  }
}

export function* addApi(payload: any): unknown {
  try {
    const response = yield call(axios.post, "userApi/addApi", payload);
    if(response?.status !== 200){
      yield put({
        type: TOAST_SHOW,
        payload: { message:response?.data?.message, severity: "error", },
      });
      return
    }
    yield put({
      type: TOAST_SHOW,
      payload: { message:response?.data?.message },
    });
    yield put({
      type: API_INSERT,
      payload: response?.data?.data,
    });
  } catch (e: any) {
    const message = e.response.data.message ?? e.message;
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: API_ERROR,
    });
  }
}

export function* getApi(): unknown {
  try {
    const {
      data: { data, message },
    } = yield call(axios.get, "userApi/getApi");

    yield put({
      type: API_FETCH,
      payload: data,
    });
  } catch (e: any) {
    const message = e.response.data.message ?? e.message;
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: API_ERROR,
    });
  }
}

export function* deleteApi(payload: any): unknown {
  try {
    const { id } = payload;
    const {
      data: { data, message },
    } = yield call(axios.delete, "userApi/deleteApi/" + id);

    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: API_DELETE,
      payload: id,
    });
  } catch (e: any) {
    const message = e.response.data.message ?? e.message;
    yield put({
      type: TOAST_SHOW,
      payload: {
        message: message,
        severity: "error",
      },
    });
    yield put({
      type: API_ERROR,
    });
  }
}
