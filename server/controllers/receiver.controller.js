import BankAccount from '../models/bank-account.model.js';
import BankType from '../models/bank-type.model.js';
import Identity from '../models/identity.model.js';
import Receiver from '../models/receiver.model.js';

export default {
    async getAll(req, res) {
        const where = { senderId: req.userId };

        const records = await Receiver.find(where);

        const responses = [];
        for (const r of records) {
            const bankAccount = await BankAccount.findById(r.receiverId);
            const bankType = await BankType.findById(bankAccount.bankTypeId);
            const identity = await Identity.findById(bankAccount.identityId);

            responses.push({
                accountNumber: bankAccount.accountNumber,
                aliasName: identity.aliasName,
                bankName: bankType.name,
            });
        }

        res.status(200).json(responses);
    },
    async create(req, res) {
        const { receiverId } = req.body;
        const document = {
            senderId: req.userId,
            receiverId,
        };

        const insertedData = await Receiver.create(document);

        res.status(200).json(insertedData);
    },
};
