import { BankAccount } from '../models/bank-account.model.js';

export class BankAccountController {
    static async getAll(req, res) {
        const records = await BankAccount.find();

        res.status(200).json(records);
    }

    static async getById(req, res) {
        const { id } = req.params;

        console.log('id', id);
        const record = await BankAccount.findById(id);

        console.log('record', record);

        res.status(200).json(record);
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

    static async update(req, res) {
        const { id } = req.params;
        const { bankTypeId } = req.body;

        console.log('id: ', id);
        console.log('bankTypeId: ', bankTypeId);

        const effected = await BankAccount.updateOne(
            {
                id,
            },
            {
                bankTypeId,
            }
        );

        res.status(200).json(effected);
    }
}
