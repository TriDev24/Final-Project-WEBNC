import Debit from '../models/debit.model.js';
import Status from '../models/status.model.js';
import service from '../services/debit.service.js';

export default {
    async createDebit(req, res) {
        const data = req.body;
        const result = await service.createDebit(data);
        if (result === 1) {
            return res.json({
                status: 'success',
                message: 'Tạo nhắc nợ thành công!',
            });
        }
        return res.json({
            status: 'error',
            message: 'Không thể tạo nhắc nợ cho chính mình!',
        });
    },

    async getAllDebit(req, res) {
        const accountNumber = req.query['accountNumber'];
        const side = req.query['side'];
        if (accountNumber && side) {
            const debits = await service.getAllDebit(side, accountNumber);
            return res.json(debits);
        }
        return res.status(204).end();
    },

    async deleteDebit(req, res) {
        const id = req.params['id'];
        const side = req.params['side'];
        if (id) {
            const result = await service.deleteDebit(id, side);
            if (result) return res.json(result);
            return res.json({
                message: 'Nhắc nợ không tồn tại!',
            });
        }
        return res.status(204).end();
    },

    async getAllNotify(req, res) {
        const accountNumber = req.params['accountNumber'];
        const result = await service.getAllNotify(accountNumber);
        return res.json(result);
    },

    async update(req, res) {
        const { id } = req.params;
        const { isPaid } = req.body;
        const where = {};

        const debit = await Debit.findById(id);
        if (!debit) {
            return res.status(404).json(`Cannot find this debit with id ${id}`);
        }

        if (isPaid) {
            const paidStatus = await Status.findOne({ name: 'paid' });

            where['statusId'] = paidStatus._id;
        }

        const updatedDebit = await Debit.updateOne(
            {
                _id: id,
            },
            where
        );
        if (!updatedDebit) {
            return res.status(401).status('Something went wrong');
        }

        return res.status(200).json('Updated Success');
    },
};
