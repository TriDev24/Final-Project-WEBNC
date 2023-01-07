import debitPath from "./debit.path.js";
import identityPath from "./identity.path.js"
import debtorPath from "./debtor.path.js";
import notifyPath from "./notify.path.js";
import userPath from "./user.path.js";
import transferMethodPath from "./transfer-method.js"
import bankTypePath from "./bank-type.js";
import receiverPath from "./receiver.js"
import changePassword from "./change-password.path.js";
import bankAccount from "./bank-account.path.js";

export default {
  ...debitPath,
  ...identityPath,
  ...debtorPath,
  ...notifyPath,
  ...userPath,
  ...transferMethodPath,
  ...bankTypePath,
  ...receiverPath,
  ...bankAccount,
  ...changePassword
};
