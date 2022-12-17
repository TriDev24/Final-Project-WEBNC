import service from "../services/debit.service.js";

export default {
  async createDebit(req, res) {
    const data = req.body;
    const result = await service.createDebit(data);
    if (result === 1) {
      return res.json({
        message: "Create success!",
      });
    }
    return res.json({
      message: "Can't create debt reminder for yourself!",
    });
  },

  async getAllDebit(req, res) {
    const accountNumber = req.query["accountNumber"];
    const side = req.query["side"];
    if (accountNumber && side) {
      const debits = await service.getAllDebit(side, accountNumber);
      return res.json(debits);
    }
    return res.status(204).end();
  },

  async deleteDebit(req, res) {
    const id = req.params["id"];
    if (id) {
      const result = await service.deleteDebit(id);
      if (result) return res.json(result);
      return res.json({
        message: "Debit does not exist",
      });
    }
    return res.status(204).end();
  },
};
