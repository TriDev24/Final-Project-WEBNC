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
    otpCode: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    signature: { type: String, default: null },
};

export default generate('Billings', schema);
