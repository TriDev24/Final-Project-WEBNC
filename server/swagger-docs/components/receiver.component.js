export default {
    Receiver: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Id của một model',
                example: '63b39a48053608b5add1461c',
            },
            senderAccountNumber: {
                type: 'string',
                description: 'Số tài khoản ngân hàng của người gửi',
                example: '243275',
            },
            receiverAccountNumber: {
                type: 'string',
                description: 'Số tài khoản ngân hàng của người nhận',
                example: '62885',
            },
            aliasName: {
                type: 'string',
                description: 'Tên gợi nhớ',
                example: 'Tiến',
            },
        },
    },
    ReceiverInput: {
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
