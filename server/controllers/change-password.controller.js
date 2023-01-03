import Identity from "../models/identity.model.js";

export default {

  async changePassword(req, res) {
    const {id, password} = req.body;

    // const hash = bcrypt.hashSync(password, 10);
    // const result = await Identity.findByIdAndUpdate(id, { password: hash });
    return res.json("OK").status(200);
    
  },

  // async changePassword(req, res) {
  //   console.log(22222222222)
  //   return res.json({
  //     status: "error",
  //     message: "Không thể tạo nhắc nợ cho chính mình!",
  //   });

  //   // res.status(200);
  //   // return res.json({
  //   //   status: "success",
  //   //   message: "Đặt lại mật khẩu thành công!",
  //   // });
  //   // const { otp, password } = req.body;
  //   // const result = await service.verifyAndChangePassword(otp, password);
  //   // if (result === 1) {
  //   //   return res.json({
  //   //     status: "success",
  //   //     message: "Đặt lại mật khẩu thành công!",
  //   //   });
  //   // } else {
  //   //   return res.json({
  //   //     status: "error",
  //   //     message: "OTP không chính xác hoặc không tồn tại!",
  //   //   });
  //   // }
  // },
};
