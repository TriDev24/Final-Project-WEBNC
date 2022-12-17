import Debit from "../models/debit.model.js";
import Status from "../models/status.model.js";
import BankAccount from "../models/bank-account.model.js";
import Debtor from "../models/debtor.model.js";

export default {
  async createDebit(data) {
    const { accountNumber, debtAccountNumber, amountToPay, content } = data;
    if (accountNumber === debtAccountNumber) {
      return -1;
    }
    const account = await BankAccount.findOne({ accountNumber });
    const debtAccount = await BankAccount.findOne({
      accountNumber: debtAccountNumber,
    });
    const status = await Status.findOne({ name: "unpaid" });
    const newDebit = {
      accountId: account._id,
      debtAccountId: debtAccount._id,
      amountToPay,
      content,
      statusId: status._id,
    };
    const debitInserted = await Debit.create(newDebit);
    const debtor = await Debtor.findOne({
      accountId: account._id,
      debtAccountId: debtAccount._id,
    });
    if (!debtor) {
      const debtorInserted = await Debtor.create({
        accountId: account._id,
        debtAccountId: debtAccount._id,
      });
    }
    return 1;
  },

  async getAllDebit(side, accountNumber) {
    let debits = [];
    const account = await BankAccount.findOne({ accountNumber });
    if (side === "personal") {
      debits = await Debit.find({ accountId: account._id }).populate([
        {
          path: "debtAccountId",
          select: "accountNumber -_id",
          populate: { path: "identityId", select: "aliasName -_id" },
        },
        { path: "statusId", select: "name -_id" },
      ]);
    } else {
      debits = await Debit.find({ debtAccountId: account._id }).populate([
        {
          path: "accountId",
          select: "accountNumber -_id",
          populate: { path: "identityId", select: "aliasName -_id" },
        },
        { path: "statusId", select: "name -_id" },
      ]);
    }
    return debits;
  },

  async deleteDebit(id) {
    const result = await Debit.findByIdAndDelete(id);
    return result;
  },
};
