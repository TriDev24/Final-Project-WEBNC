import service from "../services/notify.service.js";

export default {
  async getAllNotify(req, res) {
    const accountNumber = req.params["accountNumber"];
    const result = await service.getAllNotify(accountNumber);
    return res.json(result);
  },

  async deleteNotify(req, res) {
    const id = req.params["id"];
    const result = await service.deleteNotify(id);
    return res.json({
      message: "Xóa thành công!",
    });
  },
};
