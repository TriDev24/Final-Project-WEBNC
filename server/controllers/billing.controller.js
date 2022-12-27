import BankType from '../models/bank-type.model.js';
import Billing from '../models/billing.model.js';
import { TransferFee } from '../models/transfer-fee.model.js';
import BankAccount from '../models/bank-account.model.js';
import { TransferType } from '../models/transfer-type.model.js';
import TransferMethod from '../models/transfer-method.model.js';
import { generateOtp } from '../utils/otp.service.js';
import { sendVerifyOtpEmail } from '../utils/email.service.js';
import Identity from '../models/identity.model.js';
import { generateSignature } from '../utils/rsa.util.js';

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
        const generatedOtp = generateOtp();

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

        // Transfer ObjectId -> string using toString() method.
        const internalBank = await BankType.findOne({ name: 'My Bank' });
        const isInternalBank = internalBank._id.toString() === bankTypeId;

        if (isInternalBank) {
            let insertedData;

            // Update Bank Account OverBalance
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
                if (!updatedSenderOverBalance) {
                    return res.status(500).json('Something error');
                }

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
                            receiverBankAccount.overBalance +
                            deposit -
                            transferFee,
                    }
                );
                if (!updatedReceiverOverBalance) {
                    return res.status(500).json('Something error');
                }

                // Create Billing
                const document = {
                    senderId: senderBankAccount._id,
                    receiverId: receiverBankAccount._id,
                    deposit,
                    description,
                    transferType: TransferType.MoneyTransfer,
                    transferMethodId,
                    transferFee: TransferFee.Internal,
                    transferTime,
                    otpCode: generatedOtp,
                };

                insertedData = await Billing.create(document);
                if (!insertedData) {
                    return res.status(500).json('Something error');
                }
            } else {
                const totalAmount = deposit + TransferFee.Internal;
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
                        overBalance:
                            senderBankAccount.overBalance - totalAmount,
                    }
                );
                if (!updatedSenderOverBalance) {
                    return res.status(500).json('Something error');
                }

                // Increase over balance of receiver bank account
                const updatedReceiverOverBalance = await BankAccount.updateOne(
                    {
                        _id: receiverBankAccount._id,
                    },
                    {
                        overBalance:
                            receiverBankAccount.overBalance + totalAmount,
                    }
                );
                if (!updatedReceiverOverBalance) {
                    return res.status(500).json('Something error');
                }

                // Create Billing
                const document = {
                    senderId: senderBankAccount._id,
                    receiverId: receiverBankAccount._id,
                    deposit,
                    description,
                    transferType: TransferType.MoneyTransfer,
                    transferMethodId,
                    transferFee: TransferFee.Internal,
                    transferTime,
                    otpCode: generatedOtp,
                };

                insertedData = await Billing.create(document);

                if (!insertedData) {
                    return res.status(500).json('Something error');
                }
            }

            const identity = await Identity.findById(
                receiverBankAccount.identityId
            );
            sendVerifyOtpEmail(identity.email);

            return res.status(200).json({
                _id: insertedData._id,
            });
        }

        // Cross external bank.
        const url = `${process.env.EXTERNAL_BANK_API_URL}`;
        const payload = {
            signature: generateSignature(),
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                console.log('Ok');
            })
            .catch((error) =>
                res.status(500).json(
                    `Something error on transfer money to external bank:
                        ${error}`
                )
            );
    },

    async verifyOtp(req, res) {
        const { id } = req.params;
        const { otp } = req.body;

        const billing = await Billing.findById(id);
        if (!billing) {
            return res
                .status(404)
                .json(`Cannot find this billing with id: ${id}`);
        }

        const isNotMatchOtp = billing.otpCode !== otp;
        if (isNotMatchOtp) {
            return res.status(401).json('The Otp is Not correct');
        }

        const updatedBilling = await Billing.updateOne(
            {
                _id: id,
            },
            {
                isVerified: true,
            }
        );
        if (!updatedBilling) {
            return res.status(500).json('Something error');
        }

        return res.status(200).json(updatedBilling);
    },
};
