import { call, put } from "redux-saga/effects";

import axios from "@/axiosConfig";
import { TOAST_SHOW } from "../Actions/ToastAction";
import {
  TRANSACTION_ERROR,
  TRANSACTION_FETCH,
} from "../Actions/TransactionAction";

interface ITransactionAction {
  crudType: string;
  payload: any;
}

export function* TransactionSaga(action: ITransactionAction): unknown {
  switch (action.crudType) {
    case TRANSACTION_FETCH:
      yield getAllTransactions();
      break;

    default:
      yield put({ type: TRANSACTION_ERROR });
      break;
  }
}

export function* getAllTransactions(): unknown {
  try {
    const {
      data: { data, message },
    } = yield call(axios.post, "wallet/getAllTransactions");

    yield put({
      type: TRANSACTION_FETCH,
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
      type: TRANSACTION_ERROR,
    });
  }
}
