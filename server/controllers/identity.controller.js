import service from "../services/identity.service.js";

export default {
  async login(req, res) {
    const result = await service.login(req.body);
    if (result == -1) {
      return res.json({
        message: "Login failed!",
      });
    } else if (result == -2) {
      return res.json({
        message: "Cannot find user!",
      });
    } else if (result == -3) {
      return res.json({
        message: "Captcha is not correct!",
      });
    }
    return res.json(result);
  },

  async create(req, res) {
    const result = await service.create(req.body);
    if (result === -1) {
      return res.json({
        message: "Phone number is exist",
      });
    } else if (result === -2) {
      return res.json({
        message: "Email is exist",
      });
    }
    return res.json(result);
  },

  async generateRefreshToken(req, res) {
    const result = await service.generateAccessToken(req.body);
    if (result === -1) {
      res.json({
        message: "Token has expired",
      });
    } else if (result === -2) {
      res.json({
        message: "Token is not exist",
      });
    }
    res.json({
      accessToken: result
    });
  },
};
