import debitPath from "./debit.path.js";
import identityPath from "./identity.path.js"
import debtorPath from "./debtor.path.js";
import notifyPath from "./notify.path.js";
import userPath from "./user.path.js";

export default {
  ...debitPath,
  ...identityPath,
  ...debtorPath,
  ...notifyPath,
  ...userPath
};
