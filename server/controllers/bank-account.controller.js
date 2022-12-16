import BankAccount from '../models/bank-account.model.js';
import TokenService from '../services/token.service.js';

export default {
    async getAll(req, res) {
        const { userId } = TokenService.getPayloadFromCurrentToken(req);
        const { isPayment } = req.query;

        const where = { identityId: userId };

        if (isPayment !== null && isPayment !== undefined) {
            where['isPayment'] = isPayment;
        }

        const records = await BankAccount.find(where);

        res.status(200).json(records);
    },

    async getById(req, res) {
        const { id } = req.params;

        console.log('id', id);
        const record = await BankAccount.findById(id);

        console.log('record', record);

        res.status(200).json(record);
    },

    async create(req, res) {
        const mockData = {
            accountNumber: '12312412',
            overBalance: 0,
            isPayment: false,
            identityId: '12314',
            bankTypeId: '1',
        };

        const insertedData = await BankAccount.create(mockData);

        res.status(200).json(insertedData);
    },

    async update(req, res) {
        const { id } = req.params;
        const { bankTypeId } = req.body;

        const effected = await BankAccount.updateOne(
            {
                id,
            },
            {
                bankTypeId,
            }
        );

        res.status(200).json(effected);
    },
};
