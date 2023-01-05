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
        const now = Math.floor(Date.now() / 1000);
        const thirtyDayBeforeFromNow = now - 2506000; // 30 day

        // Get receiving billings
        const sortedReceiveBillings = await Billing.find({
            receiverId: bankAccountId,
            transferType: TransferType.MoneyTransfer,
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
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
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
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
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
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

    async getPaymentAccountHistory(req, res) {
        const { accountNumber } = req.query;
        const now = Math.floor(Date.now() / 1000);
        const thirtyDayBeforeFromNow = now - 2506000;

        const bankAccount = await BankAccount.findOne({ accountNumber });
        if (!bankAccount) {
            return res
                .status(404)
                .json(
                    `Không tìm thấy tài khoản ngân hàng với số tài khoản là: ${accountNumber}`
                );
        }

        const receiveBillings = await Billing.find({
            receiverId: bankAccount._id,
            transferType: TransferType.MoneyTransfer,
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
        });

        const parseReceiveBillings = [];
        for (const r of receiveBillings) {
            const sender = await BankAccount.findById(r.senderId);

            parseReceiveBillings.push({
                deposit: r.deposit,
                description: r.description,
                transferTime: r.transferTime,
                sender: {
                    accountNumber: sender.accountNumber,
                },
                type: 'receive',
            });
        }

        const transferBillings = await Billing.find({
            senderId: bankAccount._id,
            transferType: TransferType.MoneyTransfer,
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
        });

        const parseTransferBillings = [];
        for (const t of transferBillings) {
            const receiver = await BankAccount.findById(t.receiverId);

            parseTransferBillings.push({
                deposit: t.deposit,
                description: t.description,
                transferTime: t.transferTime,
                receiver: {
                    accountNumber: receiver.accountNumber,
                },
                type: 'transfer',
            });
        }

        // Debit
        const debitBillings = await Billing.find({
            senderId: bankAccount._id,
            transferType: TransferType.Debit,
            isVerified: true,
            createdAt: {
                $lte: now,
                $gte: thirtyDayBeforeFromNow,
            },
        });

        const parseDebitBillings = [];
        for (const d of debitBillings) {
            const receiver = await BankAccount.findById(d.receiverId);

            parseDebitBillings.push({
                deposit: d.deposit,
                description: d.description,
                transferTime: d.transferTime,
                receiver: {
                    accountNumber: receiver.accountNumber,
                },
                type: 'debit',
            });
        }

        const mergedBillings = [
            ...parseReceiveBillings,
            ...parseTransferBillings,
            ...parseDebitBillings,
        ];
        const sortedBillings = mergedBillings.sort(
            (a, b) => parseInt(b.transferTime) - parseInt(a.transferTime)
        );

        return res.status(200).json(sortedBillings);
    },

    async create(req, res) {
        const {
            senderAccountNumber,
            receiverAccountNumber,
            deposit,
            description,
            bankTypeId,
            transferMethodId,
            transferType,
            transferTime,
        } = req.body;
        const generatedOtp = generateOtp();

        const senderBankAccount = await BankAccount.findOne({
            accountNumber: senderAccountNumber,
        });
        if (!senderBankAccount) {
            return res.status(404).json('Số tài khoản người gửi không tồn tại');
        }

        const transferMethod = await TransferMethod.findById(transferMethodId);
        if (!transferMethod) {
            return res.status(404).json('Hình thưc chuyển khoản không tồn tại');
        }
        const isReceiverPayForTransferFee =
            transferMethod.name === 'Receiver Pay Transfer Fee';

        console.log('transfer type', transferType);

        // Transfer ObjectId -> string using toString() method.
        const internalBank = await BankType.findOne({ name: 'My Bank' });
        const isInternalBank = internalBank._id.toString() === bankTypeId;

        if (isInternalBank) {
            // check if receiver existed
            const receiverBankAccount = await BankAccount.findOne({
                accountNumber: receiverAccountNumber,
            });
            if (!receiverBankAccount) {
                return res
                    .status(404)
                    .json('Số tài khoản người nhận không tồn tại');
            }

            let insertedData;

            // Update Bank Account OverBalance
            if (isReceiverPayForTransferFee) {
                const isSenderNotEnoughMoney =
                    senderBankAccount.overBalance < deposit;
                if (isSenderNotEnoughMoney) {
                    return res
                        .status(403)
                        .json(
                            'Tài khoản người nhận không đủ tiền để thực hiện hành động này'
                        );
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
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
                }

                // Increase over balance of receiver bank account
                const isReceiverNotEnoughMoneyToPayTransferFee =
                    receiverBankAccount.overBalance + deposit <
                    TransferFee.Internal;
                if (isReceiverNotEnoughMoneyToPayTransferFee) {
                    res.status(403).json('Người nhận không đủ trả tiền phí');
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
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
                }

                // Create Billing
                const document = {
                    senderId: senderBankAccount._id,
                    receiverId: receiverBankAccount._id,
                    deposit,
                    description,
                    transferType: transferType ?? TransferType.MoneyTransfer,
                    transferMethodId,
                    transferFee: TransferFee.Internal,
                    transferTime,
                    otpCode: generatedOtp,
                };

                insertedData = await Billing.create(document);
                if (!insertedData) {
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
                }
            } else {
                const totalAmount = deposit + TransferFee.Internal;
                const isSenderNotEnoughMoney =
                    senderBankAccount.overBalance < totalAmount;
                if (isSenderNotEnoughMoney) {
                    return res.status(403).json('Bạn không đủ tiền để trả phí');
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
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
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
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
                }

                // Create Billing
                const document = {
                    senderId: senderBankAccount._id,
                    receiverId: receiverBankAccount._id,
                    deposit,
                    description,
                    transferType: transferType ?? TransferType.MoneyTransfer,
                    transferMethodId,
                    transferFee: TransferFee.Internal,
                    transferTime,
                    otpCode: generatedOtp,
                };

                insertedData = await Billing.create(document);
                if (!insertedData) {
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại');
                }
            }

            const sender = await Identity.findById(
                senderBankAccount.identityId
            );
            console.log('sender.email', sender.email);
            console.log('generatedOtp', generatedOtp);

            sendVerifyOtpEmail(sender.email, generatedOtp);

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
                res.status(200).json('Thành công!!!');
            })
            .catch((error) =>
                res.status(500).json(
                    `Đã có lỗi xảy ra, vui lòng thử lại on transfer money to external bank:
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
                .json(`Không thể tìm thấy hoá đơn với id là: ${id}`);
        }

        const isNotMatchOtp = billing.otpCode !== otp;
        if (isNotMatchOtp) {
            return res.status(403).json('Mã OTP không đúng');
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
            return res.status(500).json('Đã có lỗi xảy ra, vui lòng thử lại');
        }

        return res.status(200).json(updatedBilling);
    },
};
