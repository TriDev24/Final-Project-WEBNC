import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    accountNumber: String,
    overBalance: Number,
    isPayment: Boolean,
    identityId: { type: mongoose.Types.ObjectId, ref: 'Identities' },
    bankTypeId: { type: mongoose.Types.ObjectId, ref: 'Bank-Types' },
};

export default generate('Bank-Accounts', schema);
