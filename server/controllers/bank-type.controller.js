import BankType from '../models/bank-type.model.js';

export default {
    async getAll(req, res) {
        const records = await BankType.find();

        res.status(200).json(records);
    },
};
