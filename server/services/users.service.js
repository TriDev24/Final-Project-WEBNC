import Identity from '../models/identity.model.js';
import Permission from '../models/permission.model.js';

export default {
    async getAllUser(query) {
        let users = [];
        const { role } = query;
        const where = {};

        if (role) {
            const permission = await Permission.findOne({ name: role });

            where['permissionId'] = permission._id;
        }

        users = await Identity.find(where);
        return users;
    },

    async getUserDetail(userId) {
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await Identity.findById(userId);
            return user;
        }
        console.log('-1');
        return -1;
    },

    async updateUser(id, firstName, lastName, phoneNumber, aliasName) {
        const result = await Identity.findByIdAndUpdate(id, {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            aliasName: aliasName,
        });
        return result;
    },
};
