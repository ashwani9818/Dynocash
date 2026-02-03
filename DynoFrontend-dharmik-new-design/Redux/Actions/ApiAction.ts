export const API_INIT: any = "API_INIT";
export const API_INSERT = "API_INSERT";
export const API_FETCH = "API_FETCH";
export const API_DELETE = "API_DELETE";
export const API_ERROR = "API_ERROR";

export const ApiAction = (type?: string, data?: any) => {
  return { type: API_INIT, payload: data, crudType: type };
};
