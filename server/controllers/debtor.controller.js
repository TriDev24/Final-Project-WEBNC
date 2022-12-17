import service from "../services/debtor.service.js";

export default {
  async getAllDebtor(req, res) {
    const accountNumber = req.query["accountNumber"];
    if (accountNumber) {
      const debtors = await service.getAllDebtor(accountNumber);
      return res.json(debtors);
    }
    return res.status(204).end();
  },

  async deleteDebtor(req, res) {
    const id = req.params["id"];
    if (id) {
      const result = await service.deleteDebtor(id);
      if (result) return res.json(result);
      return res.json({
        message: "Debtor does not exist",
      });
    }
    return res.status(204).end();
  },
};
