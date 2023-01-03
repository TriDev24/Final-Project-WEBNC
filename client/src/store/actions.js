import {
  SET_PROFILE,
  SET_AUTH,
  SET_PAYMENT_ACCOUNT_NUMBER,
  SET_BANK_TYPES,
  SET_TRANSFER_METHODS,
} from "./constants.js";

export const setProfile = (payload) => ({
  type: SET_PROFILE,
  payload,
});

export const setAuth = (payload) => ({
  type: SET_AUTH,
  payload,
});

export const setPaymentAccountNumber = (payload) => ({
  type: SET_PAYMENT_ACCOUNT_NUMBER,
  payload,
});

export const setBankTypes = (payload) =>({
    type:SET_BANK_TYPES,
    payload
})

export const setTransferMethods = (payload) =>({
    type:SET_TRANSFER_METHODS,
    payload
})