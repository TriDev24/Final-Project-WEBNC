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
        } else if (result === -2) {
            return res.json({
                status: 'error',
                message: 'Số tài khoản không tồn tại!',
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
        const { content } = req.body;
        if (id) {
            const result = await service.deleteDebit(id, side, content);
            if (result === -1)
                return res.json({
                    status: 'error',
                    message: 'Không thể tạo nhắc nợ cho chính mình!',
                });
            else if (result === -2) {
                return res.json({
                    message: 'Nhắc nợ đã được thanh toán!',
                });
            } else if (result) {
                return res.json(result);
            }
            return res.json({
                message: 'Nhắc nợ không tồn tại!',
            });
        }
        return res.status(204).end();
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
            if (result === -1)
                return res.json({
                    message: 'Nhắc nợ đã bị hủy!',
                });
            else if (result) {
                return res.json(result);
            }
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

    async updateDebit(req, res) {
        const { id } = req.params;
        const { isPaid } = req.body;
        const result = await service.updateDebit(id, isPaid);
        if (result === -1) {
            return res.status(401).status('Có lỗi xảy ra');
        } else if (result == -2) {
            return res
                .status(404)
                .json(`Không tìm thấy nhắc nợ với id = ${id}`);
        }
        return res.status(200).json('Cập nhập thành công');
    },
};
