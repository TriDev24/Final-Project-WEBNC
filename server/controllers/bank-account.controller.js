import BankAccount from '../models/bank-account.model.js';
import {
    generateHashString,
    generateSignature,
    verifySignature,
} from '../utils/rsa.util.js';
import { TransferFee } from '../models/transfer-fee.model.js';
import TransferMethod from '../models/transfer-method.model.js';
import BankType from '../models/bank-type.model.js';
import fetch from 'node-fetch';
import Identity from '../models/identity.model.js';
import { ObjectID } from 'bson';
import { TransferType } from '../models/transfer-type.model.js';
import Billing from '../models/billing.model.js';

export default {
    async getAll(req, res) {
        const joinWithIdentity = {
            $lookup: {
                from: 'identities',
                localField: 'identityId',
                foreignField: '_id',
                as: 'identities',
            },
        };

        const pipelines = [joinWithIdentity];

        const records = await BankAccount.aggregate(pipelines);
        const bankAccounts = Array.from(records.values());

        console.log('bankAccounts', bankAccounts);

        const responses = bankAccounts.map((b) => {
            return {
                _id: b._id,
                accountNumber: b.accountNumber,
                overBalance: b.overBalance,
                identity: {
                    aliasName: b.identities[0].aliasName,
                },
            };
        });

        return res.status(200).json(responses);
    },

    async queryAccount(req, res) {
        try {
            const { timestamp } = req.query;
            const {
                accountNumber,
                hashValue: requestHashValue,
                signature,
            } = req.body;
            const now = Math.floor(Date.now() / 1000);

            const partnerBankUrl = process.env.PARTNER_BANK_API_URL_PATH;
            const requestHost = req.get('host');

            // Is Not from Host
            const isNotFromPartnerBankConnectedBefore =
                !partnerBankUrl.includes(requestHost);
            if (isNotFromPartnerBankConnectedBefore) {
                return res.status(401).json({
                    error: 'Xin lỗi domain của bạn không được truy cập vào nguồn tài nguyên này',
                });
            }

            // Is Edited?
            const payload = {
                accountNumber,
                timestamp,
                signature,
            };
            const hashString = generateHashString(payload);
            const isPayloadEdited = hashString !== requestHashValue;

            if (isPayloadEdited) {
                return res.status(401).json({
                    error: 'Xin lỗi gói tin của bạn hình như đã bị chỉnh sửa, vui lòng xem lại',
                });
            }

            // Is Timeout?
            const oneDayOnSecond = 86400;
            const isTimeout = now - timestamp > oneDayOnSecond;
            if (isTimeout) {
                return res.status(401).json({
                    error: 'Xin lỗi đã hết thời gian truy vấn tài khoản.',
                });
            }

            // Is Not Valid Signature
            verifySignature(signature);

            const bankAccount = await BankAccount.findOne({ accountNumber });
            if (!bankAccount) {
                return res
                    .status(401)
                    .json({ error: 'Không tìm thấy tài khoản ngân hàng' });
            }

            if (bankAccount.isPayment === false) {
                return res.status(401).json({
                    error: 'Xin lỗi đây không phải tài khoản thanh toán',
                });
            }

            const identity = await Identity.findById(bankAccount.identityId);
            const response = {
                id: bankAccount._id,
                accountNumber,
                type: 'Tài khoản thanh toán',
                user: {
                    fullName: identity.firstName + ' ' + identity.lastName,
                    aliasName: identity.aliasName,
                    email: identity.email,
                    phoneNumber: identity.phoneNumber,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },

    async getAllByUserId(req, res) {
        const { isPayment } = req.query;

        const where = { identityId: req.userId };

        if (isPayment !== null && isPayment !== undefined) {
            where['isPayment'] = isPayment;
        }

        const records = await BankAccount.find(where);

        res.status(200).json(records);
    },

    async getById(req, res) {
        const { id } = req.params;
        const record = await BankAccount.findById(id);

        res.status(200).json(record);
    },

    async getByAccountNumberAndBankType(req, res) {
        const { accountNumber, bankTypeId } = req.query;

        const internalBankType = await BankType.findOne({ name: 'My Bank' });
        const isInternalBank = internalBankType._id.toString() === bankTypeId;

        console.log('isInternalBank', isInternalBank);

        if (isInternalBank) {
            const bankAccount = await BankAccount.findOne({ accountNumber });
            console.log('bankAccount ne', bankAccount);
            if (!bankAccount) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy tài khoản ngân hàng' });
            }

            const identity = await Identity.findById(bankAccount.identityId);
            const response = {
                id: bankAccount._id,
                accountNumber: bankAccount.accountNumber,
                user: {
                    id: identity._id,
                    email: identity.email,
                    fullname: identity.aliasName,
                    phone: identity.phoneNumber,
                },
            };

            return res.status(200).json(response);
        } else {
            // const payload = {
            //     path: '/partnerBank/queryAccount',
            // };
            // const response = await fetch(
            //     process.env.PARTNER_BANK_GENERATE_TOKEN_URL_PATH,
            //     {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(payload),
            //     }
            // );

            // const { timestamp, encrypt } = await response.json();

            // Get
            const url = `https://backend.cloudvscode.com/account/getInfoAccountPartner?accountNumber=317348370&bankCode=BIDV`;
            const request = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InR1eWVuYnVpMzAzMEBnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkJ1aSBRdWFuZyBUdXllbiIsImlkIjoxLCJpYXQiOjE2NzI4NTAwMzksImV4cCI6MTY3NDY1MDAzOX0.TO4xn2lxK7DF0XoY_ISZ39NOSAx7Os8OZbvhfvVW_K4`,
                },
            });

            const dataResponse = await request.json();
            const { accountNumber: externalBankAccountNumber } = dataResponse;

            if (externalBankAccountNumber !== accountNumber) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy tài khoản ngân hàng' });
            }

            return res.status(200).json(dataResponse);
        }
    },

    async create(req, res) {
        const { identityId } = req.body;

        const defaultBank = await BankType.findOne({ name: 'My Bank' });
        const defaultBankAccount = {
            accountNumber: Math.floor(Math.random() * 1000000),
            overBalance: 0,
            isPayment: false,
            identityId: identityId,
            bankTypeId: defaultBank._id,
        };

        const insertedData = await BankAccount.create(defaultBankAccount);
        if (!insertedData) {
            return res.status(500).json({ message: 'Đã có lỗi xảy ra' });
        }

        res.status(200).json(defaultBankAccount);
    },

    async update(req, res) {
        const { id } = req.params;
        const { isPayment, isLockActionTrigger, deposit } = req.body;

        const session = await BankAccount.startSession();
        session.startTransaction();
        try {
            const bankAccount = await BankAccount.findById(id);
            if (!bankAccount) {
                return res.status(404).json('Cannot find this Bank Account');
            }

            if (isPayment) {
                const records = await BankAccount.find({
                    identityId: req.userId,
                });

                const processedRecords = records.map((r) => {
                    if (r._id.toString() === id) {
                        r.isPayment = true;
                        return r;
                    }

                    r.isPayment = false;
                    return r;
                });

                const bulk = BankAccount.collection.initializeOrderedBulkOp();

                if (processedRecords.length > 0) {
                    processedRecords.forEach((r) =>
                        bulk
                            .find({
                                _id: r._id,
                            })
                            .updateOne({ $set: r })
                    );
                    await bulk.execute();
                    await session.commitTransaction();
                }

                return res.status(200).json('Update Bank Account Successfully');
            }

            if (isLockActionTrigger) {
                const updatedBankAccount = await BankAccount.updateOne(
                    {
                        _id: id,
                    },
                    {
                        isLocked: !bankAccount.isLocked,
                    }
                );
                if (!updatedBankAccount) {
                    return res
                        .status(500)
                        .json('Đã có lỗi xảy ra, vui lòng thử lại sau!!!');
                }

                return res.status(200).json('Cập nhật thành công!!!');
            }

            const where = {};

            if (deposit) {
                if (deposit < 0) {
                    return res.status(401).json('Không được nhập số âm');
                }
                where['overBalance'] = bankAccount.overBalance + deposit;
            }

            const updatedBankAccount = await BankAccount.updateOne(
                {
                    _id: id,
                },
                where
            );
            if (!updatedBankAccount) {
                res.status(500).json(
                    'Đã có lỗi xảy ra, vui lòng thử lại sau!!!'
                );
            }

            return res.status(200).json('Cập nhật thành công!!!');
        } catch (error) {
            await session.abortTransaction();
            return res
                .status(500)
                .json('Đã có lỗi xảy ra, vui lòng thử lại sau!!!');
        }
    },

    // API for another bank to connect
    async rechargeMoney(req, res) {
        try {
            const {
                senderAccountNumber,
                receiverAccountNumber,
                deposit,
                hashValue: requestHashValue,
                signature,
                description,
                transferTime,
            } = req.body;
            const now = Math.floor(Date.now() / 1000);
            const partnerBankUrl = process.env.PARTNER_BANK_API_URL_PATH;
            const requestHost = req.get('host');
            // ------- Check Security ------

            // Is Correct Host?
            const isNotFromPartnerBankConnectedBefore =
                !partnerBankUrl.includes(requestHost);
            if (isNotFromPartnerBankConnectedBefore) {
                return res.status(401).json({
                    error: 'Xin lỗi domain của bạn không được truy cập vào nguồn tài nguyên này',
                });
            }

            // Is Timeout?
            const oneDayOnSecond = 86400;
            const isTimeout = now - transferTime > oneDayOnSecond;
            if (isTimeout) {
                return res.status(401).json({
                    error: 'Xin lỗi đã hết thời gian chuyển khoản.',
                });
            }

            // Is Edited?
            const payload = {
                senderAccountNumber,
                receiverAccountNumber,
                deposit,
                transferTime,
                signature,
            };
            const hashString = generateHashString(payload);
            const isPayloadEdited = hashString !== requestHashValue;

            if (isPayloadEdited) {
                return res.status(401).json({
                    error: 'Xin lỗi gói tin của bạn hình như đã bị chỉnh sửa, vui lòng xem lại',
                });
            }

            // Verify signature
            verifySignature(signature);

            const receiverBankAccount = await BankAccount.findOne({
                accountNumber: receiverAccountNumber,
            });
            if (!receiverBankAccount) {
                return res
                    .status(404)
                    .json('Không tìm thấy tài khoản ngân hàng này');
            }

            const updatedReceiverBankAccount = await BankAccount.updateOne(
                {
                    _id: receiverBankAccount._id,
                },
                {
                    overBalance: receiverBankAccount.overBalance + deposit,
                }
            );
            if (!updatedReceiverBankAccount) {
                return res.status(500).json({ error: 'Đã có lỗi xảy ra!!!' });
            }

            // Save it billing.
            const transferMethod = await TransferMethod.findOne({
                name: 'Sender Pay Transfer Fee',
            });

            const document = {
                senderId: new ObjectID(),
                receiverId: receiverBankAccount._id,
                senderAccountNumber,
                receiverAccountNumber,
                deposit,
                description: description ?? '',
                transferType: TransferType.MoneyTransfer,
                transferMethodId: transferMethod._id,
                transferFee: TransferFee.External,
                transferTime,
                signature,

                // Because the transaction was verified from sender side so receiver side don't need to do that again.
                isVerified: true,
            };

            const insertedData = await Billing.create(document);
            if (!insertedData) {
                return res.status(500).json({ error: 'Đã có lỗi xảy ra!!!' });
            }

            const response = {
                billing: {
                    id: insertedData._id,
                    senderAccountNumber: insertedData.senderAccountNumber,
                    receiverAccountNumber: insertedData.receiverAccountNumber,
                    deposit: insertedData.deposit,
                    transferFee: insertedData.transferFee,
                    transferTime: insertedData.transferTime,
                    signature: insertedData.signature,
                },
            };
            return res.status(200).json(response);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
};
