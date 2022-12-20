import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    senderId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
    transferMethodId: {
        type: mongoose.Types.ObjectId,
        ref: 'Transfer-Methods',
    },
    transferType: String,
    deposit: Number,
    description: String,
    transferFee: Number,
    transferTime: String,
};

export default generate('Billings', schema);
