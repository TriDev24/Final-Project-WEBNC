import generate from "./generic.model.js";
import mongoose from "mongoose";

const schema = {
  accountId: { type: mongoose.Types.ObjectId, ref: "Bank-Accounts" },
  debtAccountId: { type: mongoose.Types.ObjectId, ref: "Bank-Accounts" },
  amountToPay: Number,
  content: String,
  statusId: { type: mongoose.Types.ObjectId, ref: "Status" },
  transferDate: { type: String, default: null },
  isRead:{type:Boolean, default:false}
};

export default generate("Debits", schema);
