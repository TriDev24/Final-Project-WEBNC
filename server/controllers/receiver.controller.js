import BankAccount from '../models/bank-account.model.js';
import Identity from '../models/identity.model.js';
import Receiver from '../models/receiver.model.js';

export default {
    async getAll(req, res) {
        const { accountNumber } = req.query;

        const where = { senderAccountNumber: accountNumber };

        const records = await Receiver.find(where);

        const responses = [];
        for (const r of records) {
            const receiverBankAccount = await BankAccount.findOne({
                accountNumber: r.receiverAccountNumber,
            });
            const identity = await Identity.findById(
                receiverBankAccount.identityId
            );

            responses.push({
                accountNumber: receiverBankAccount.accountNumber,
                aliasName: identity.aliasName,
                bankTypeId: receiverBankAccount.bankTypeId,
            });
        }

        res.status(200).json(responses);
    },
    async create(req, res) {
        const { senderAccountNumber, receiverAccountNumber } = req.body;
        const document = {
            senderAccountNumber,
            receiverAccountNumber,
        };

        const insertedData = await Receiver.create(document);

        res.status(200).json(insertedData);
    },
};
