import {
  SET_AUTH,
  SET_BANK_TYPES,
  SET_PAYMENT_ACCOUNT_NUMBER,
  SET_PROFILE,
  SET_TRANSFER_METHODS,
} from "./constants.js";

const fetchToken = async () => {
  const url = window.location.protocol + "//" + window.location.host + "/login";
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const data = JSON.stringify({
      refreshToken,
    });
    const result = await fetch(
      `${process.env.REACT_APP_IDENTITY_API_URL_PATH}/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    )
      .then((response) => response.json())
      .then((data) => data);
    if (result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
    } else {
      localStorage.clear();
      window.location.replace(url);
    }
  }
};

fetchToken();

const initState = {
  profile: JSON.parse(localStorage.getItem("profile")),
  isAuth: localStorage.getItem("accessToken"),
  paymentAccountNumber: localStorage.getItem("payment-account-number"),
  bankTypes: JSON.parse(localStorage.getItem("bank-types")),
  transferMethods: JSON.parse(localStorage.getItem("transfer-methods")),
};

function reducer(state, action) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case SET_AUTH:
      return {
        ...state,
        isAuth: action.payload,
      };
    case SET_PAYMENT_ACCOUNT_NUMBER:
      return {
        ...state,
        paymentAccountNumber: action.payload,
      };
    case SET_BANK_TYPES:
      return {
        ...state,
        bankTypes: action.payload,
      };
    case SET_TRANSFER_METHODS:
      return {
        ...state,
        transferMethods: action.payload,
      };
    default:
      throw new Error("Invalid action.");
  }
}

export { initState };
export default reducer;
