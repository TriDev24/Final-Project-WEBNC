import generate from './generic.model.js';
import mongoose from 'mongoose';

const schema = {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    refreshToken: String,
    permissionId: { type: mongoose.Types.ObjectId, ref: 'Permissions' },
    aliasName: String,
};

export default generate('Identities', schema);
