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

  async updateUser(req, res) {
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
};
