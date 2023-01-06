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
            const {
                accountNumber,
                hashValue: requestHashValue,
                signature,
            } = req.body;

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
                signature,
            };
            const hashString = generateHashString(payload);
            const isPayloadEdited = hashString !== requestHashValue;

            if (isPayloadEdited) {
                return res.status(401).json({
                    error: 'Xin lỗi gói tin của bạn hình như đã bị chỉnh sửa, vui lòng xem lại',
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

            const identity = await Identity.findById(bankAccount.identityId);
            const response = {
                id: bankAccount._id,
                accountNumber,
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
            const payload = {
                path: '/partnerBank/queryAccount',
            };
            const response = await fetch(
                process.env.PARTNER_BANK_GENERATE_TOKEN_URL_PATH,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const { timestamp, encrypt } = await response.json();

            // Get
            const url = `${process.env.PARTNER_BANK_QUERY_ACCOUNT_URL_PATH}?timestamp=${timestamp}`;
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${encrypt}`,
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
        const { isPayment, isLocked, deposit } = req.body;

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

            if (isLocked) {
                const updatedBankAccount = await BankAccount.updateOne(
                    {
                        _id: id,
                    },
                    {
                        isLocked,
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
                // Transfer method that other bank send
                transferMethod,
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
            const onHourOnSecond = 3600;
            const isTimeout = now - transferTime > onHourOnSecond;
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
                transferMethod,
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

            const totalAmount =
                transferMethod === 'Receiver pay'
                    ? deposit - TransferFee.External
                    : deposit;

            const updatedReceiverBankAccount = await BankAccount.updateOne(
                {
                    _id: receiverBankAccount._id,
                },
                {
                    overBalance: receiverBankAccount.overBalance + totalAmount,
                }
            );
            if (!updatedReceiverBankAccount) {
                return res.status(500).json({ error: 'Đã có lỗi xảy ra!!!' });
            }

            // Save it billing.
            const correspondTransferMethod =
                transferMethod === 'Receiver pay'
                    ? await TransferMethod.findOne({
                          name: 'Receiver Pay Transfer Fee',
                      })
                    : await TransferMethod.findOne({
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
                transferMethodId: correspondTransferMethod._id,
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

            return res.status(200).json({ billing: insertedData });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
};
