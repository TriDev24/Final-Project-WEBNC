import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    accountNumber: String,
    overBalance: String,
    isPayment: Boolean,
    identityId: {type: mongoose.Types.ObjectId, ref: "Identity"},
    bankTypeId: {type: mongoose.Types.ObjectId, ref: "Bank-Type"},
};

export default generate('Bank-Accounts', schema);
