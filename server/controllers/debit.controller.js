import service from "../services/debit.service.js";

export default {
  async createDebit(req, res) {
    const data = req.body;
    const result = await service.createDebit(data);
    if (result === 1) {
      return res.json({
        status: "success",
        message: "Tạo nhắc nợ thành công!",
      });
    }
    return res.json({
      status: "error",
      message: "Không thể tạo nhắc nợ cho chính mình!",
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
        message: "Nhắc nợ không tồn tại!",
      });
    }
    return res.status(204).end();
  },

  async getDebitNotRead(req, res) {
    const accountNumber = req.params["accountNumber"];
    const result = await service.getDebitNotRead(accountNumber)
    return res.json(result);
  },
};
