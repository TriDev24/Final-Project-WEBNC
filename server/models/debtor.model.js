import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    accountId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
    debtAccountId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
};

export default generate('Debtors', schema);
