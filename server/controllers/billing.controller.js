import BankType from '../models/bank-type.model.js';
import Billing from '../models/billing.model.js';
import { TransferMethod } from '../models/transfer-method.model.js';
import { TransferFee } from '../models/transfer-fee.model.js';
import BankAccount from '../models/bank-account.model.js';
import { TransferType } from '../models/transfer-type.model.js';

export default {
    async create(req, res) {
        const {
            senderAccountNumber,
            receiverAccountNumber,
            deposit,
            description,
            bankTypeId,
            transferTime,
        } = req.body;

        const internalBank = await BankType.findOne({ name: 'My Bank' });

        // Transfer ObjectId -> string using toString() method.
        const isInternalBank = internalBank._id.toString() === bankTypeId;

        console.log('isInternalBank', isInternalBank);

        const transferMethod = isInternalBank
            ? TransferMethod.Internal
            : TransferMethod.External;
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

        const totalAmount = deposit + transferFee;
        const isNotEnoughMoney = senderBankAccount.overBalance < totalAmount;
        if (isNotEnoughMoney) {
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
            transferMethod,
            transferFee,
            transferTime,
            totalAmount,
        };

        const insertedData = await Billing.create(document);

        res.status(200).json(insertedData);
    },
};
