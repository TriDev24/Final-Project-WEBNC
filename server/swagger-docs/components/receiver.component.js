export default {
    BankAccount: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Id của một model',
                example: '63b39a48053608b5add1461c',
            },
            senderAccountNumber: {
                type: 'string',
                description: 'Số tài khoản ngân hàng',
                example: '243275',
            },
            receiverAccountNumber: {
                type: 'integer',
                description: 'Số dư tài khoản',
                example: 50000,
            },
            aliasName: {
                type: 'boolean',
                description: 'Cờ hiệu đánh dấu tài khoản thanh toán',
                example: 'true',
            },
        },
    },
    DebitInput: {
        type: 'object',
        properties: {
            receiverAccountNumber: {
                type: 'string',
                description: 'Id của người nhận',
                example: '899604',
            },
            aliasName: {
                type: 'string',
                require: false,
                description: 'Tên thường gọi của người nhận (không bắt buộc)',
                example: 'Tèo Em',
            },
        },
    },
};
