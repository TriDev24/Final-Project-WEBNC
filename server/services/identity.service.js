import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Identity from '../models/identity.model.js';
import BankAccount from '../models/bank-account.model.js';
import Permission from '../models/permission.model.js';
import BankType from '../models/bank-type.model.js';

export default {
    async login({ email, password, g_token }) {
        const urlCaptcha = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${g_token}`;
        const result = await fetch(urlCaptcha)
            .then((response) => response.json())
            .then((data) => data.success);
        if (result) {
            const identity = await Identity.findOne({ email });
            if (identity) {
                const hash = identity.password;
                const result = bcrypt.compareSync(password, hash);
                if (result) {
                    const accessToken = jwt.sign(
                        {
                            data: identity._id,
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            algorithm: 'HS256',
                            expiresIn: '30d',
                        }
                    );
                    const refreshToken = jwt.sign(
                        {
                            data: identity._id,
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
        let { aliasName } = data;
        const isIdentityExist = await Identity.findOne({ email });
        const isPhoneExist = await Identity.findOne({ phoneNumber });
        if (!isIdentityExist) {
            if (!isPhoneExist) {
                const permission = await Permission.findOne({ name: 'user' });
                const hash = bcrypt.hashSync(password, 10);
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
                const bankAccount = {
                    accountNumber: Math.floor(Math.random() * 1000000),
                    overBalance: 0,
                    isPayment: true,
                    identityId: identityInserted._id,
                    bankTypeId: bankType._id,
                };
                const bankAccountInserted = await BankAccount.create(
                    bankAccount
                );
                return bankAccountInserted;
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
                        expiresIn: '30d',
                    }
                );
                const test = await Identity.findById(decode.data);
                console.log(test);
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
};
