import Debtor from "../models/debtor.model.js";
import BankAccount from "../models/bank-account.model.js";

export default {
  async getAllDebtor(accountNumber) {
    const account = await BankAccount.findOne({ accountNumber });
    const debtors = await Debtor.find({ accountId: account._id }).populate({
      path: "debtAccountId",
      select: "accountNumber -_id",
      populate: { path: "identityId", select: "aliasName -_id" },
    });
    return debtors;
  },

  async deleteDebtor(id) {
    const result = await Debtor.findByIdAndDelete(id);
    return result;
  },
};
