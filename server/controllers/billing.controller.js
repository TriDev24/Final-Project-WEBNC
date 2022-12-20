import BankType from '../models/bank-type.model.js';
import Billing from '../models/billing.model.js';
import { TransferFee } from '../models/transfer-fee.model.js';
import BankAccount from '../models/bank-account.model.js';
import { TransferType } from '../models/transfer-type.model.js';
import TransferMethod from '../models/transfer-method.model.js';

export default {
    async create(req, res) {
        const {
            senderAccountNumber,
            receiverAccountNumber,
            deposit,
            description,
            bankTypeId,
            transferMethodId,
            transferTime,
        } = req.body;

        const internalBank = await BankType.findOne({ name: 'My Bank' });

        // Transfer ObjectId -> string using toString() method.
        const isInternalBank = internalBank._id.toString() === bankTypeId;

        const transferFee = isInternalBank
            ? TransferFee.Internal
            : TransferFee.External;

        // Update Bank Account OverBalance
        const senderBankAccount = await BankAccount.findOne({
            accountNumber: senderAccountNumber,
        });
        if (!senderBankAccount) {
            return res.status(404).json('Sender Account Number not Found');
        }

        const receiverBankAccount = await BankAccount.findOne({
            accountNumber: receiverAccountNumber,
        });
        if (!receiverBankAccount) {
            return res.status(404).json('Receiver Account Number not Found');
        }

        const transferMethod = await TransferMethod.findById(transferMethodId);
        if (!transferMethod) {
            return res.status(404).json('Transfer Method was not Found');
        }
        const isReceiverPayForTransferFee =
            transferMethod.name === 'Receiver Pay Transfer Fee';

        if (isReceiverPayForTransferFee) {
            const isSenderNotEnoughMoney =
                senderBankAccount.overBalance < deposit;
            if (isSenderNotEnoughMoney) {
                return res.status(403).json('Not enough money to transfer');
            }

            // Decrease over balance of sender bank account
            const updatedSenderOverBalance = await BankAccount.updateOne(
                {
                    _id: senderBankAccount._id,
                },
                {
                    overBalance: senderBankAccount.overBalance - deposit,
                }
            );

            // Increase over balance of receiver bank account
            const isReceiverNotEnoughMoneyToPayTransferFee =
                receiverBankAccount.overBalance + deposit < transferFee;
            if (isReceiverNotEnoughMoneyToPayTransferFee) {
                res.status(401).json(
                    'Receiver Not Enough Money To Pay Transfer Fee'
                );
            }

            const updatedReceiverOverBalance = await BankAccount.updateOne(
                {
                    _id: receiverBankAccount._id,
                },
                {
                    overBalance:
                        receiverBankAccount.overBalance + deposit - transferFee,
                }
            );

            // Create Billing
            const document = {
                senderId: senderBankAccount._id,
                receiverId: receiverBankAccount._id,
                deposit,
                description,
                transferType: TransferType.MoneyTransfer,
                transferMethodId,
                transferFee,
                transferTime,
            };

            const insertedData = await Billing.create(document);

            res.status(200).json(insertedData);
        } else {
            const totalAmount = deposit + transferFee;
            const isSenderNotEnoughMoney =
                senderBankAccount.overBalance < totalAmount;
            if (isSenderNotEnoughMoney) {
                return res.status(403).json('Not enough money to transfer');
            }

            // Decrease over balance of sender bank account
            const updatedSenderOverBalance = await BankAccount.updateOne(
                {
                    _id: senderBankAccount._id,
                },
                {
                    overBalance: senderBankAccount.overBalance - totalAmount,
                }
            );

            // Increase over balance of receiver bank account
            const updatedReceiverOverBalance = await BankAccount.updateOne(
                {
                    _id: receiverBankAccount._id,
                },
                {
                    overBalance: receiverBankAccount.overBalance + totalAmount,
                }
            );

            // Create Billing
            const document = {
                senderId: senderBankAccount._id,
                receiverId: receiverBankAccount._id,
                deposit,
                description,
                transferType: TransferType.MoneyTransfer,
                transferMethodId,
                transferFee,
                transferTime,
            };

            const insertedData = await Billing.create(document);

            res.status(200).json(insertedData);
        }
    },
};
