import service from "../services/identity.service.js";

export default {
  async login(req, res) {
    const result = await service.login(req.body);
    if (result == -1) {
      return res.json({
        message: "Đăng nhập thất bại!",
      });
    } else if (result == -2) {
      return res.json({
        message: "Tài khoản không tồn tại!",
      });
    } else if (result == -3) {
      return res.json({
        message: "Captcha không chính xác!",
      });
    }
    return res.json(result);
  },

  async create(req, res) {
    const result = await service.create(req.body);
    if (result === -1) {
      return res.json({
        message: "Số điện thoại đã tồn tại!",
      });
    } else if (result === -2) {
      return res.json({
        message: "Email đã tồn tại!",
      });
    }
    return res.json(result);
  },

  async generateRefreshToken(req, res) {
    const result = await service.generateAccessToken(req.body);
    if (result === -1) {
      res.json({
        message: "Token đã hết hạn!",
      });
    } else if (result === -2) {
      res.json({
        message: "Token không tồn tại!",
      });
    }
    res.json({
      accessToken: result
    });
  },
};
