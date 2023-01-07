export default {
    Billing: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Id của một model',
                example: '63b39a48053608b5add1461c',
            },
            senderId: {
                type: 'string',
                description: 'Id tài khoản ngân hàng của người gửi',
                example: '6399b69c68d8f792ed3bde8f',
            },
            receiverId: {
                type: 'string',
                description: 'Id tài khoản ngân hàng của người nhận',
                example: '6399b20568d8f792ed3bde7f',
            },
            transferMethodId: {
                type: 'string',
                description: 'Id phương thức giao dịch',
                example: '63a15646e6ee6f225248396b',
            },
            transferType: {
                type: 'string',
                description: 'Loại giao dịch (chuyển tiền, thanh toán nhắc nợ)',
                example: 50000,
            },
            deposit: {
                type: 'string',
                description: 'Số tien gửi',
                example: 'Trả tiền tết',
            },
            description: {
                type: 'string',
                description: 'Nội dung chuyển khoản',
                example: '1672658618550',
            },
            transferFee: {
                type: 'integer',
                description:
                    'Phí giao dich (nội bộ: 1100(VNĐ), liên ngân hàng: 3400(VNĐ))',
                example: '1672658586182',
            },
            transferTime: {
                type: 'string',
                description: 'Ngày chuyển khoản',
                example: '1672658618550',
            },
        },
    },
    OTPCode: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Id của một model',
                example: '63b8ff67f53a15dc2e45317b',
            },
            otpCode: {
                type: 'string',
                description: 'OTP code',
                example: '3842',
            },
        },
    },
    CreateBilling: {
        type: 'object',
        properties: {
            senderId: {
                type: 'string',
                description: 'Id tài khoản ngân hàng của người gửi',
                example: '6399b20568d8f792ed3bde7f',
            },
            receiverId: {
                type: 'string',
                description: 'Id tài khoản ngân hàng của người nhận',
                example: '6399b69c68d8f792ed3bde8f',
            },
            senderAccountNumber: {
                type: 'string',
                description: 'Số tài khoản người gửi',
                example: '62885',
            },
            receiverAccountNumber: {
                type: 'string',
                description: 'Số tài khoản người nhận',
                example: 186672,
            },
            deposit: {
                type: 'string',
                description: 'Số tien gửi',
                example: 'Trả tiền tết',
            },
            description: {
                type: 'string',
                description: 'Nội dung chuyển khoản',
                example: '100000',
            },
            transferType: {
                type: 'string',
                description: 'Loại giao dịch (chuyển tiền, thanh toán nhắc nợ)',
                example: 'money-transfer',
            },
            transferMethodId: {
                type: 'string',
                description: 'Id phương thức giao dịch',
                example: '63a15646e6ee6f225248396b',
            },
            transferFee: {
                type: 'integer',
                description:
                    'Phí giao dich (nội bộ: 1100(VNĐ), liên ngân hàng: 3400(VNĐ))',
                example: '1100',
            },
            transferTime: {
                type: 'string',
                description: 'Ngày chuyển khoản',
                example: '1673068390284',
            },
            otpCode: {
                type: 'string',
                description: 'OTP',
                example: '3842',
            },
        },
    },
};
