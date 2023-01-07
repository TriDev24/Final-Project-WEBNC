import BankAccount from '../models/bank-account.model.js';
import BankType from '../models/bank-type.model.js';
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
            const bankType = await BankType.findById(
                receiverBankAccount.bankTypeId
            );

            responses.push({
                _id: r._id,
                accountNumber: receiverBankAccount.accountNumber,
                aliasName: r.aliasName,
                bankType: {
                    id: receiverBankAccount.bankTypeId,
                    name: bankType.name,
                },
            });
        }

        res.status(200).json(responses);
    },
    async getById(req, res) {
        const { id } = req.params;

        const receiver = await Receiver.findById(id);
        if (!receiver) {
            return res
                .status(404)
                .json(`Không tìm thấy người nhận với id: ${id}`);
        }

        return res.status(200).json(receiver);
    },
    async create(req, res) {
        const {
            senderAccountNumber,
            receiverAccountNumber,
            isExternalTransaction,
            aliasName,
        } = req.body;

        if (isExternalTransaction) {
            const document = {
                senderAccountNumber,
                receiverAccountNumber,
                aliasName: 'Người nhận ngoài ngân hàng',
            };

            const insertedData = await Receiver.create(document);
            if (!insertedData) {
                return res.status(500).json({ message: 'Đã có lỗi xảy ra!!!' });
            }

            return res.status(200).json(insertedData);
        }

        const receiverBankAccount = await BankAccount.findOne({
            accountNumber: receiverAccountNumber,
        });
        if (!receiverBankAccount) {
            return res.status(401).json({
                message: `Không tìm thấy người nhận với tài khoản ${receiverBankAccount}`,
            });
        }

        const receiverInformation = await Identity.findById(
            receiverBankAccount.identityId
        );

        const document = {
            senderAccountNumber,
            receiverAccountNumber,
            aliasName: aliasName ?? receiverInformation.aliasName,
        };

        const insertedData = await Receiver.create(document);

        res.status(200).json(insertedData);
    },
    async update(req, res) {
        const { id } = req.params;
        const { aliasName } = req.body;

        const receiver = await Receiver.findById(id);
        if (!receiver) {
            return res
                .status(404)
                .json(`Không tìm thấy người nhận với id: ${id}`);
        }

        const updatedReceiver = await Receiver.updateOne(
            {
                _id: id,
            },
            {
                aliasName,
            }
        );
        if (!updatedReceiver) {
            return res.status(500).json(`Đã có lỗi xảy ra, vui lòng thử lại`);
        }

        return res.status(200).json('Cập nhật thành công');
    },
    async delete(req, res) {
        const { id } = req.params;

        const receiver = await Receiver.findById(id);
        if (!receiver) {
            return res
                .status(404)
                .json(`Không tìm thấy người nhận với id: ${id}`);
        }

        const effected = await Receiver.deleteOne({
            _id: id,
        });
        if (!effected) {
            return res.status(500).json(`Đã có lỗi xảy ra`);
        }

        return res.status(200).json('Xoá người nhận thành công');
    },
};
