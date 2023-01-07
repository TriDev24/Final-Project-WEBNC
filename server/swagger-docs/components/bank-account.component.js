export default {
    BankAccount: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Id của một model',
                example: '63b39a48053608b5add1461c',
            },
            accountNumber: {
                type: 'string',
                description: 'Số tài khoản ngân hàng',
                example: '243275',
            },
            overBalance: {
                type: 'integer',
                description: 'Số dư tài khoản',
                example: 50000,
            },
            isPayment: {
                type: 'boolean',
                description: 'Cờ hiệu đánh dấu tài khoản thanh toán',
                example: 'true',
            },
            identityId: {
                type: 'string',
                description: 'Id của người dùng tài khoản',
                example: '639996cbd1b37c5632ac204c',
            },
            bankTypeId: {
                type: 'string',
                description: 'Id của loại ngân hàng',
                example: '639e0560b35655896b2aa759',
            },
            isLocked: {
                type: 'string',
                description: 'Cờ hiệu thông báo tài khoản bị khoá hay không',
                example: 'false',
            },
            createdAt: {
                type: 'string',
                description: 'Ngày tạo',
                example: '1672658586182',
            },
            updatedAt: {
                type: 'string',
                description: 'Ngày cập nhập',
                example: '1672658618550',
            },
        },
    },
    BankAccountInput: {
        type: 'object',
        properties: {
            identityId: {
                type: 'string',
                description: 'Id của người dùng tài khoản',
                example: '639996cbd1b37c5632ac204c',
            },
        },
    },
};
