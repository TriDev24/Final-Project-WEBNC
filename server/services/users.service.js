import Identity from '../models/identity.model.js';
import Permission from '../models/permission.model.js';

export default {

  async getAllUser() {
    let users = [];
    const permission = await Permission.findOne({ name: 'user' });
    users = await Identity.find({permissionId: permission._id});
    return users;
  },

  async getUserDetail(userId) {
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await Identity.findById(userId);
      return user;
    }
    console.log("-1");
    return -1;
  },


};
