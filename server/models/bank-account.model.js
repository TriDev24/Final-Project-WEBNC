import { generateModel } from './generate-model.js';

const bankAccountSchema = {
    accountNumber: String,
    overBalance: String,
    isPayment: Boolean,
    identityId: String,
    bankTypeId: String,
};

export const BankAccount = generateModel('bank-accounts', bankAccountSchema);
