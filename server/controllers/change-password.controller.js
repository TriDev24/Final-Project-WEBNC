// import service from "../services/users.service.js";

export default {

  async changePassword(req, res) {
    const id = req.params["id"];
    const firstName = req.body["firstName"];
    const lastName = req.body["lastName"];
    const phoneNumber = req.body["phoneNumber"];
    const aliasName = req.body["aliasName"];
    const result = await service.updateUser(id, firstName, lastName, phoneNumber, aliasName);
    if (result === null){
      return res.json("NOT FOUND").status(404);
    }
    const user = await service.getUserDetail(result._id.toString());
    return res.json(user).status(200);
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
