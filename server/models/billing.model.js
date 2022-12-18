import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    senderId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'Bank-Accounts' },
    transferMethod: String,
    transferType: String,
    deposit: Number,
    transferFee: Number,
    transferTime: String,
    totalAmount: Number,
};

export default generate('Billings', schema);
