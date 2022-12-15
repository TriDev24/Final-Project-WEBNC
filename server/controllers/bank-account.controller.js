import { BankAccount } from '../models/bank-account.model.js';
import { TokenService } from '../services/token.service.js';

export class BankAccountController {
    static async getAll(req, res) {
        const { userId } = TokenService.getPayloadFromCurrentToken(req);

        const records = await BankAccount.find({
            identityId: userId,
        });

        res.status(200).json(records);
    }

    static async getById(req, res) {
        const { id } = req.params;

        const record = await BankAccount.findById(id);

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

    static async getPaymentBankAccount(req, res) {
        const { userId } = TokenService.getPayloadFromCurrentToken(req);

        const records = await BankAccount.find({
            identityId: userId,
            isPayment: true,
        });

        res.status(200).json(records);
    }

    static async update(req, res) {
        const { id } = req.params;
        const { bankTypeId } = req.body;

        const foundedBankAccount = await BankAccount.findById(id);
        if (!foundedBankAccount) {
            res.status(404).json({
                message: 'Cannot find Bank account with id',
            });
        }

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

    static async delete(req, res) {
        const { id } = req.params;

        const foundedBankAccount = await BankAccount.findById(id);
        if (!foundedBankAccount) {
            res.status(404).json({
                message: 'Cannot find Bank account with id',
            });
        }

        const effected = await BankAccount.deleteOne({
            id,
        });

        res.status(200).json(effected);
    }
}
