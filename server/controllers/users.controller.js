import service from '../services/users.service.js';

export default {
    async getAllUser(req, res) {
        const users = await service.getAllUser(req.query);
        return res.status(200).json(users);
    },

    async getUserDetail(req, res) {
        const idUser = req.params['id'];
        const user = await service.getUserDetail(idUser);
        if (user === -1) {
            return res.status(404).json('Không tìm thấy người dùng');
        }
        return res.json(user).status(200);
    },

    async updateUser(req, res) {
        const id = req.params['id'];
        const firstName = req.body['firstName'];
        const lastName = req.body['lastName'];
        const phoneNumber = req.body['phoneNumber'];
        const aliasName = req.body['aliasName'];
        const result = await service.updateUser(
            id,
            firstName,
            lastName,
            phoneNumber,
            aliasName
        );
        if (result === null) {
            return res.status(404).json('Không tìm thấy người dùng');
        }
        const user = await service.getUserDetail(result._id.toString());
        return res.json(user).status(200);
    },
};
