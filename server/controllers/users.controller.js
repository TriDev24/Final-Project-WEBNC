import service from "../services/users.service.js";

export default {

  async getAllUser(req, res) {
    const users = await service.getAllUser();
    return res.json(users).status(200);
  },

//   async getUserDetail(req, res) {
//     const accountNumber = req.query["accountNumber"];
//     const side = req.query["side"];
//     if (accountNumber && side) {
//       const debits = await service.getAllDebit(side, accountNumber);
//       return res.json(debits);
//     }
//     return res.status(204).end();
//   },

//   async updateUser(req, res) {
//     const id = req.params["id"];
//     if (id) {
//       const result = await service.deleteDebit(id);
//       if (result) return res.json(result);
//       return res.json({
//         message: "Debit does not exist",
//       });
//     }
//     return res.status(204).end();
//   },
//   async changePassword(req, res) {
//     const id = req.params["id"];
//     if (id) {
//       const result = await service.deleteDebit(id);
//       if (result) return res.json(result);
//       return res.json({
//         message: "Debit does not exist",
//       });
//     }
//     return res.status(204).end();
//   }
};
