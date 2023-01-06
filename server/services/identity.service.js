import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Identity from '../models/identity.model.js';
import BankAccount from '../models/bank-account.model.js';
import Permission from '../models/permission.model.js';
import BankType from '../models/bank-type.model.js';
import fetch from 'node-fetch';
import { sendEmailForgotPassowrd } from '../utils/email.util.js';
import { generateOtp } from '../utils/otp.util.js';
import redis from '../utils/redis.util.js';

export default {
    async login({ email, password, g_token }) {
        const urlCaptcha = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${g_token}`;
        const result = await fetch(urlCaptcha)
            .then((response) => response.json())
            .then((data) => data.success);
        if (result) {
            const getUserMatchedWithEmail = {
                $match: {
                    email,
                },
            };
            const joinWithPermissionTable = {
                $lookup: {
                    from: 'permissions',
                    localField: 'permissionId',
                    foreignField: '_id',
                    as: 'permission',
                },
            };
            const pipelines = [
                getUserMatchedWithEmail,
                joinWithPermissionTable,
            ];
            const records = await Identity.aggregate(pipelines);

            const identity = Array.from(records.values()).at(0);
            if (identity) {
                const hash = identity.password;
                const result = bcrypt.compareSync(password, hash);
                if (result) {
                    const accessToken = jwt.sign(
                        {
                            data: {
                                id: identity._id,
                                role: identity.permission[0].name,
                            },
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            algorithm: 'HS256',
                            expiresIn: '1m',
                        }
                    );
                    const refreshToken = jwt.sign(
                        {
                            data: {
                                id: identity._id,
                                role: identity.permission[0].name,
                            },
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            algorithm: 'HS256',
                            expiresIn: '7d',
                        }
                    );
                    const profile = {
                        email: identity.email,
                        firstName: identity.firstName,
                        lastName: identity.lastName,
                        phoneNumber: identity.phoneNumber,
                        aliasName: identity.aliasName,
                        role: identity.permission[0].name,
                    };
                    await Identity.updateOne({ email }, { refreshToken });
                    return { accessToken, refreshToken, profile };
                }
                return -1;
            }
            return -2;
        } else {
            return -3;
        }
    },

    async create(data) {
        const { email, password, firstName, lastName, phoneNumber } = data;
        console.log('hash', data);

        let { aliasName } = data;
        const isIdentityExist = await Identity.findOne({ email });
        const isPhoneExist = await Identity.findOne({ phoneNumber });
        if (!isIdentityExist) {
            if (!isPhoneExist) {
                const permission = await Permission.findOne({
                    name: 'customer',
                });
                const hash = bcrypt.hashSync(password, 10);
                console.log('hash', hash);
                if (aliasName === '') {
                    aliasName = firstName + ' ' + lastName;
                }
                const newIdentity = {
                    email,
                    password: hash,
                    firstName,
                    lastName,
                    phoneNumber,
                    refreshToken: null,
                    permissionId: permission._id,
                    aliasName,
                };
                const identityInserted = await Identity.create(newIdentity);
                const bankType = await BankType.findOne({ name: 'My Bank' });
                const newBankAccount = {
                    accountNumber: Math.floor(Math.random() * 1000000),
                    overBalance: 0,
                    isPayment: true,
                    identityId: identityInserted._id,
                    bankTypeId: bankType._id,
                };
                const bankAccountInserted = await BankAccount.create(
                    newBankAccount
                );
                return bankAccountInserted;
            } else {
                return -1;
            }
        } else {
            return -2;
        }
    },

    async createEmployee(data) {
        const { emailEmployee, passwordEmployee, firstNameEmployee, lastNameEmployee, phoneNumberEmployee } = data;
        console.log('hash', data);

        let { aliasNameEmployee } = data;
        const isIdentityExist = await Identity.findOne({ email:emailEmployee });
        const isPhoneExist = await Identity.findOne({ phoneNumber:phoneNumberEmployee });
        if (!isIdentityExist) {
            if (!isPhoneExist) {
                const permission = await Permission.findOne({
                    name: 'employee',
                });
                const hash = bcrypt.hashSync(passwordEmployee, 10);
                console.log('hash', hash);
                if (aliasNameEmployee === '') {
                    aliasNameEmployee = firstNameEmployee + ' ' + lastNameEmployee;
                }
                const newIdentity = {
                    email:emailEmployee,
                    password: hash,
                    firstName:firstNameEmployee,
                    lastName:lastNameEmployee,
                    phoneNumber:phoneNumberEmployee,
                    refreshToken: null,
                    permissionId: permission._id,
                    aliasName:aliasNameEmployee,
                };
                const identityInserted = await Identity.create(newIdentity);
                return identityInserted;
            } else {
                return -1;
            }
        } else {
            return -2;
        }
    },

    async generateAccessToken({ refreshToken }) {
        try {
            const isTokenExist = await Identity.findOne({ refreshToken });
            if (isTokenExist) {
                const decode = jwt.verify(
                    refreshToken,
                    process.env.JWT_SECRET_KEY
                );
                const accessToken = jwt.sign(
                    {
                        data: decode.data,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        algorithm: 'HS256',
                        expiresIn: '1m',
                    }
                );
                return accessToken;
            } else {
                return -2;
            }
        } catch (err) {
            if (err.message === 'jwt expired') {
                return -1;
            }
        }
    },

    async sendMail(email) {
        const otp = generateOtp();
        const identity = await Identity.findOne({ email });
        if (identity) {
            await redis.set(`${otp}`, `${identity._id}`, {
                EX: 300,
            });
            const result = await sendEmailForgotPassowrd(email, otp);
            return result;
        }
        return -2;
    },

    async verifyAndChangePassword(otp, newPassword) {
        const id = await redis.get(otp);
        if (id) {
            const hash = bcrypt.hashSync(newPassword, 10);
            const result = await Identity.findByIdAndUpdate(id, {
                password: hash,
            });
            await redis.del(otp);
            return 1;
        } else return -1;
    },
};
