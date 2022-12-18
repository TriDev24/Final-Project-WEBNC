import service from "../services/users.service.js";

export default {

  async getAllUser(req, res) {
    const users = await service.getAllUser();
    return res.json(users).status(200);
  },

  async getUserDetail(req, res) {
    const idUser = req.params["id"];
    const user = await service.getUserDetail(idUser);
    if (user===-1){
      return res.json("NOT FOUND").status(404);
    }
    return res.json(user).status(200);
  },
};
