import BankType from '../models/bank-type.model.js';
import Billing from '../models/billing.model.js';
import { TransferFee } from '../models/transfer-fee.model.js';
import BankAccount from '../models/bank-account.model.js';
import { TransferType } from '../models/transfer-type.model.js';
import TransferMethod from '../models/transfer-method.model.js';
import { generateOtp } from '../utils/otp.util.js';
import { sendVerifyOtpEmail } from '../utils/email.util.js';
import Identity from '../models/identity.model.js';
import { generateSignature } from '../utils/rsa.util.js';

export default {
    async getHistory(req, res) {
        const { bankAccountId } = req.query;

        // Get receiving billings
        const sortedReceiveBillings = await Billing.find({
            receiverId: bankAccountId,
            transferType: TransferType.MoneyTransfer,
        }).sort({ createdAt: -1 });

        let receiveBillingSummaries = [];
        for (const r of sortedReceiveBillings) {
            const transferMethod = await TransferMethod.findById(
                r.transferMethodId
            );
            const totalAmount =
                transferMethod === 'Sender Pay Transfer Fee'
                    ? r.deposit
                    : r.deposit + r.transferFee;
            const senderBankAccount = await BankAccount.findById(r.senderId);
            const senderInformation = await Identity.findById(
                senderBankAccount.identityId
            );

            const billing = {
                _id: r._id,
                sender: {
                    name: senderInformation.aliasName,
                    accountNumber: senderBankAccount.accountNumber,
                },
                totalAmount,
                transferTime: r.transferTime,
            };
            receiveBillingSummaries.push(billing);
        }

        // Get Send Billings
        const sortedTransferBillings = await Billing.find({
            senderId: bankAccountId,
            transferType: TransferType.MoneyTransfer,
        }).sort({ createdAt: -1 });

        let transferBillingSummaries = [];
        for (const t of sortedTransferBillings) {
            const transferMethod = await TransferMethod.findById(
                t.transferMethodId
            );
            const totalAmount =
                transferMethod === 'Sender Pay Transfer Fee'
                    ? t.deposit + t.transferFee
                    : t.deposit;
            const receiverBankAccount = await BankAccount.findById(
                t.receiverId
            );
            const receiverInformation = await Identity.findById(
                receiverBankAccount.identityId
            );

            const billing = {
                _id: t._id,
                receiver: {
                    name: receiverInformation.aliasName,
                    accountNumber: receiverBankAccount.accountNumber,
                },
                totalAmount,
                transferTime: t.transferTime,
            };
            transferBillingSummaries.push(billing);
        }

        // Get Debit Billings
        const sortDebitBillings = await Billing.find({
            senderId: bankAccountId,
            transferType: TransferType.Debit,
        }).sort({ createdAt: -1 });

        const debitBillingSummaries = [];
        for (const d of sortDebitBillings) {
            const receiverBankAccount = await BankAccount.findById(
                d.receiverId
            );
            const receiverInformation = await Identity.findById(
                receiverBankAccount.identityId
            );

            return {
                _id: d._id,
                receiver: {
                    name: receiverInformation.aliasName,
                    accountNumber: receiverBankAccount.accountNumber,
                },
                deposit: d.deposit,
                transferTime: d.transferTime,
            };
        }

        return res.status(200).json({
            receives: receiveBillingSummaries,
            transfers: transferBillingSummaries,
            debits: debitBillingSummaries,
        });
    },

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

        const transferMethod = await TransferMethod.findById(transferMethodId);
        if (!transferMethod) {
            return res.status(404).json('Transfer Method was not Found');
        }
        const isReceiverPayForTransferFee =
            transferMethod.name === 'Receiver Pay Transfer Fee';

        // Transfer ObjectId -> string using toString() method.
        const internalBank = await BankType.findOne({ name: 'My Bank' });
        const isInternalBank = internalBank._id.toString() === bankTypeId;

        console.log('is internal', isInternalBank);

        if (isInternalBank) {
            console.log('is internal');
            // check if receiver existed
            const receiverBankAccount = await BankAccount.findOne({
                accountNumber: receiverAccountNumber,
            });
            if (!receiverBankAccount) {
                return res
                    .status(404)
                    .json('Receiver Account Number not Found');
            }

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
                    receiverBankAccount.overBalance + deposit <
                    TransferFee.Internal;
                if (isReceiverNotEnoughMoneyToPayTransferFee) {
                    res.status(403).json(
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
                            TransferFee.Internal,
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
            sendVerifyOtpEmail(identity.email, generatedOtp);

            return res.status(200).json({
                _id: insertedData._id,
            });
        }

        // Verify that receiver bank account existed by receiver bank account number
        // fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });

        // Cross external bank.
        const generatedSignature = generateSignature();

        const url = `${process.env.EXTERNAL_BANK_API_URL}`;
        const payload = {
            description,
            deposit,
            signature: generatedSignature,
        };

        // Goi API cap nhat so du cua API lien ket
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                res.status(200).json('Successfully');
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
            return res.status(403).json('The Otp is Not correct');
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
