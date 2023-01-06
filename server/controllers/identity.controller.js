import Identity from '../models/identity.model.js';
import service from '../services/identity.service.js';

export default {
    async getAll(req, res) {
        const identities = await Identity.find();

        return res.status(200).json(identities);
    },

    async login(req, res) {
        const result = await service.login(req.body);
        if (result == -1) {
            return res.json({
                message: 'Sai mật khẩu!',
            });
        } else if (result == -2) {
            return res.json({
                message: 'Tài khoản không tồn tại!',
            });
        } else if (result == -3) {
            return res.json({
                message: 'Captcha không chính xác!',
            });
        }
        return res.json(result);
    },

    async create(req, res) {
        const result = await service.create(req.body);
        if (result === -1) {
            return res.json({
                message: 'Số điện thoại đã tồn tại!',
            });
        } else if (result === -2) {
            return res.json({
                message: 'Email đã tồn tại!',
            });
        }
        return res.json(result);
    },

    async createEmployee(req, res) {
        const result = await service.create(req.body);
        if (result === -1) {
            return res.json({
                message: 'Số điện thoại đã tồn tại!',
            });
        } else if (result === -2) {
            return res.json({
                message: 'Email đã tồn tại!',
            });
        }
        return res.json(result);
    },

    async generateAccessToken(req, res) {
        const result = await service.generateAccessToken(req.body);
        if (result === -1) {
            return res.json({
                message: 'Token đã hết hạn!',
            });
        } else if (result === -2) {
            return res.json({
                message: 'Token không tồn tại!',
            });
        } else {
            return res.json({
                accessToken: result,
            });
        }
    },

    async sendMail(req, res) {
        const { email } = req.params;
        const result = await service.sendMail(email);
        if (result === 1) {
            return res.json({
                status: 'success',
                message:
                    'Chúng tôi đã gửi đến email của bạn mã OTP, mong bạn kiểm tra và xác nhận mã OTP',
            });
        } else if (result === -2) {
            return res.json({
                status: 'error',
                message: 'Email không tồn tại!',
            });
        } else {
            return res.json({
                status: 'error',
                message:
                    'Hệ thống của chúng tôi gặp một số trục trặc, chúng tôi sẽ sớm sửa lại, mong bạn thông cảm!',
            });
        }
    },

    async verifyAndChangePassword(req, res) {
        const { otp, password } = req.body;
        const result = await service.verifyAndChangePassword(otp, password);
        if (result === 1) {
            return res.json({
                status: 'success',
                message: 'Đặt lại mật khẩu thành công!',
            });
        } else {
            return res.json({
                status: 'error',
                message: 'OTP không chính xác hoặc không tồn tại!',
            });
        }
    },
};
