import Identity from "../models/identity.model.js";
import bcrypt from "bcrypt";

export default {

  async changePassword(req, res) {
    const {newPassword, oldPassword, refreshToken} = req.body;
    const indentify = await Identity.find({ refreshToken: refreshToken })
    const id = indentify[0]._id
    const hash = bcrypt.hashSync(newPassword, 10);
    const result = await Identity.findByIdAndUpdate(id, { password: hash });
    return res.json({"message": "Change password success"}).status(200);
  },
};
