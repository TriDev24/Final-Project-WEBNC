import Debit from "../models/debit.model.js";
import Status from "../models/status.model.js";
import BankAccount from "../models/bank-account.model.js";
import Debtor from "../models/debtor.model.js";
import Notify from "../models/notify.model.js";
import { broadCast } from "../utils/ws.util.js";

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
    if (account && debtAccount) {
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
      const notify = await Notify.create({
        senderId: debitInserted.accountId,
        receiverId: debitInserted.debtAccountId,
        statusId: status._id,
        side:"personal",
      });
      const bankAccount = await BankAccount.findById(debitInserted.debtAccountId);
      broadCast(bankAccount.accountNumber);
      return 1;
    } else {
      return -2;
    }
  },

  async getAllDebit(side, accountNumber) {
    let debits = [];
    const account = await BankAccount.findOne({ accountNumber });
    if (side === "personal") {
      debits = await Debit.find({ accountId: account._id })
        .populate([
          {
            path: "debtAccountId",
            select: "accountNumber -_id",
            populate: { path: "identityId", select: "aliasName -_id" },
          },
          { path: "statusId", select: "name -_id" },
        ])
        .sort({ updatedAt: "desc" });
    } else {
      debits = await Debit.find({ debtAccountId: account._id })
        .populate([
          {
            path: "accountId",
            select: "accountNumber -_id",
            populate: { path: "identityId", select: "aliasName -_id" },
          },
          { path: "statusId", select: "name -_id" },
        ])
        .sort({ updatedAt: "desc" });
    }
    return debits;
  },

  async deleteDebit(id, side, content) {
    const debit = await Debit.findById(id);
    const cancelled = await Status.findOne({ name: "cancelled" });
    const paid = await Status.findOne({ name: "paid" });
    if (debit.statusId.toString() === paid._id.toString()) {
      return -2;
    }
    if (debit.statusId.toString() === cancelled._id.toString()) {
      return -1;
    }
    const result = await Debit.findByIdAndUpdate(id, {
      content,
      statusId: cancelled._id,
      updatedAt: Date.now(),
    });
    if (side === "personal") {
      const notify = await Notify.create({
        senderId: result.accountId,
        receiverId: result.debtAccountId,
        statusId: cancelled._id,
        side,
      });
      const account = await BankAccount.findById(result.debtAccountId);
      broadCast(account.accountNumber);
    } else {
      const notify = await Notify.create({
        senderId: result.debtAccountId,
        receiverId: result.accountId,
        statusId: cancelled._id,
        side,
      });
      const account = await BankAccount.findById(result.accountId);
      broadCast(account.accountNumber);
    }

    return result;
  },

  async updateDebit(id, isPaid) {
    const where = {};
    const debit = await Debit.findById(id);
    if (!debit) {
      return -2;
    }

    if (isPaid) {
      const paidStatus = await Status.findOne({ name: "paid" });

      where["statusId"] = paidStatus._id;
      where["transferDate"] = Date.now();
      where["updatedAt"] = Date.now();
    }

    const updatedDebit = await Debit.findByIdAndUpdate(
      {
        _id: id,
      },
      where
    );
    if (!updatedDebit) {
      return -1;
    }
    const notify = await Notify.create({
      senderId: updatedDebit.debtAccountId,
      receiverId: updatedDebit.accountId,
      statusId: where["statusId"],
      side: "other",
    });
    const account = await BankAccount.findById(updatedDebit.accountId);
    broadCast(account.accountNumber);

    return 1;
  },
};
