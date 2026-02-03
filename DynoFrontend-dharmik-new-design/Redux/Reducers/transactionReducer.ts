import { ReducerAction } from "@/utils/types";
import { transactionReducer as ITransactionReducer } from "@/utils/types";

import {
  TRANSACTION_ERROR,
  TRANSACTION_FETCH,
  TRANSACTION_INIT,
} from "../Actions/TransactionAction";

const transactionInitialState: ITransactionReducer = {
  customers_transactions: [],
  self_transactions: [],
  loading: false,
};

const transactionReducer = (
  state = transactionInitialState,
  action: ReducerAction
) => {
  const { payload } = action;

  switch (action.type) {
    case TRANSACTION_INIT:
      return {
        ...state,
        loading: true,
      };

    case TRANSACTION_FETCH:
      return {
        ...state,
        loading: false,
        customers_transactions: payload.customers_transactions,
        self_transactions: payload.self_transactions,
      };
    case TRANSACTION_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return {
        ...state,
      };
  }
};

export default transactionReducer;
