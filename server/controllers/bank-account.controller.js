import BankAccount from '../models/bank-account.model.js';
import { verifySignature } from '../utils/rsa.util.js';

export default {
    async getAll(req, res) {
        const { isPayment } = req.query;

        const where = { identityId: req.userId };

        if (isPayment !== null && isPayment !== undefined) {
            where['isPayment'] = isPayment;
        }

        const records = await BankAccount.find(where);

        res.status(200).json(records);
    },

    async getById(req, res) {
        const { id } = req.params;
        const record = await BankAccount.findById(id);

        res.status(200).json(record);
    },

    async create(req, res) {
        const { identityId } = req.body;

        const defaultBank = await BankType.findOne({ name: 'My Bank' });

        const defaultBankAccount = {
            accountNumber: Math.floor(Math.random() * 1000000),
            overBalance: 0,
            isPayment: false,
            identityId: identityId,
            bankTypeId: defaultBank._id,
        };

        const insertedData = await BankAccount.create(defaultBankAccount);

        res.status(200).json(insertedData);
    },

    async update(req, res) {
        const { id } = req.params;
        const { isPayment } = req.body;

        const session = await BankAccount.startSession();
        session.startTransaction();
        try {
            if (isPayment) {
                const records = await BankAccount.find({
                    identityId: req.userId,
                });

                const processedRecords = records.map((r) => {
                    if (r._id.toString() === id) {
                        r.isPayment = true;
                        return r;
                    }

                    r.isPayment = false;
                    return r;
                });

                const bulk = BankAccount.collection.initializeOrderedBulkOp();

                if (processedRecords.length > 0) {
                    processedRecords.forEach((r) =>
                        bulk
                            .find({
                                _id: r._id,
                            })
                            .updateOne({ $set: r })
                    );
                    await bulk.execute();
                    await session.commitTransaction();
                }
            }

            return res.status(200).json('Update Bank Account Successfully');
        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json('Something went wrong on server');
        }
    },

    async rechargeMoney(req, res) {
        const { id } = req.params;
        const { deposit, signature } = req.body;

        const isNotValidSignature = verifySignature(signature);
        if (isNotValidSignature) {
            return res.status(401).json('Not valid signature');
        }

        const bankAccount = await BankAccount.findById(id);
        if (!bankAccount) {
            return res.status(404).json('Cannot find this Bank Account');
        }

        const updatedBankAccount = await BankAccount.updateOne(
            {
                _id: id,
            },
            {
                overBalance: bankAccount.overBalance + deposit,
            }
        );
        if (!updatedBankAccount) {
            return res.status(500).json('Something error');
        }

        return res.status(200).json('Recharge successfully');
    },
};
