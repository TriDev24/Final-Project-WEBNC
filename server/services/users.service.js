import Identity from '../models/identity.model.js';

export default {

  async getAllUser() {
    let users = [];
    users = await Identity.find();
    return users;
  },

//   async getAllUser(data) {
//     const { accountNumber, debtAccountNumber, amountToPay, content } = data;
//     if (accountNumber === debtAccountNumber) {
//       return -1;
//     }
//     const account = await BankAccount.findOne({ accountNumber });
//     const debtAccount = await BankAccount.findOne({
//       accountNumber: debtAccountNumber,
//     });
//     const status = await Status.findOne({ name: "unpaid" });
//     const newDebit = {
//       accountId: account._id,
//       debtAccountId: debtAccount._id,
//       amountToPay,
//       content,
//       statusId: status._id,
//     };
//     const debitInserted = await Debit.create(newDebit);
//     const debtor = await Debtor.findOne({
//       accountId: account._id,
//       debtAccountId: debtAccount._id,
//     });
//     if (!debtor) {
//       const debtorInserted = await Debtor.create({
//         accountId: account._id,
//         debtAccountId: debtAccount._id,
//       });
//     }
//     return 1;
//   },

//   async deleteDebit(id) {
//     const result = await Debit.findByIdAndDelete(id);
//     return result;
//   },
};
