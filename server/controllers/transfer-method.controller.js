import TransferMethods from '../models/transfer-method.model.js';

export default {
    async getAll(req, res) {
        const transferMethods = await TransferMethods.find();

        res.status(200).json(transferMethods);
    },
};
