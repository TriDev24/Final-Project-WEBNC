import generate from "./generic.model.js";
import mongoose from "mongoose";

const schema = {
  senderId: { type: mongoose.Types.ObjectId, ref: "Bank-Accounts" },
  receiverId: { type: mongoose.Types.ObjectId, ref: "Bank-Accounts" },
  statusId: { type: mongoose.Types.ObjectId, ref: "Status" },
  side: String,
};

export default generate("Notify", schema);
