import { BankAccount } from '../models/bank-account.model.js';

export class BankAccountController {
    static async getAll(req, res) {
        const records = await BankAccount.find();

        res.status(200).json(records);
    }

    static async create(req, res) {
        const mockData = {
            accountNumber: '12312412',
            overBalance: 0,
            isPayment: false,
            identityId: '12314',
            bankTypeId: '1',
        };

        const insertedData = await BankAccount.create(mockData);

        res.status(200).json(insertedData);
    }
}
