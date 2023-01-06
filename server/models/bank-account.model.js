import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    accountNumber: String,
    overBalance: Number,
    isPayment: Boolean,
    identityId: { type: mongoose.Types.ObjectId },
    bankTypeId: { type: mongoose.Types.ObjectId, ref: 'Bank-Types' },
    isLocked: { type: Boolean, default: false },
};

export default generate('Bank-Accounts', schema);
