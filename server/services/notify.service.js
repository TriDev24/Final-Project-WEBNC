import Notify from "../models/notify.model.js";
import BankAccount from "../models/bank-account.model.js";

export default {
  async getAllNotify(accountNumber) {
    const account = await BankAccount.findOne({ accountNumber });
    const notifies = await Notify.find({ receiverId: account._id })
      .populate([
        {
          path: "senderId",
          select: "accountNumber -_id",
          populate: { path: "identityId", select: "aliasName -_id" },
        },
        { path: "statusId", select: "name -_id" },
      ])
      .sort({ updatedAt: "desc" })
      .limit(10);

    const count = notifies.length;

    return {
      count,
      notifies,
    };
  },

  async deleteNotify(id) {
    const result = await Notify.findByIdAndDelete(id);
    return result;
  },
};
