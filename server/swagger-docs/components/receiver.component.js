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
            senderAccountNumber:{
                type: 'string',
                description: 'Số tài khoản người gửi',
                example: '899604',
            },

            receiverAccountNumber: {
                type: 'string',
                description: 'Số tài khoản người nhận',
                example: '899604',
            },
            isExternalTransaction:{
                type: 'boolean',
                description: 'Có phải là giao dịch bên ngoài hay không',
                example: false,
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
