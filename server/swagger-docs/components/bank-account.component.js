import { Int32 } from "mongodb";

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
    BankAccountQueryInput: {
        type: 'object',
        properties: {
            accountNumber: {
                type: 'string',
                description: 'Số tài khoản của người dùng tài khoản',
                example: '639996cbd1b37c5632ac204c',
            },
            hashValue: {
                type: 'string',
                description: 'Mã hash value',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
            signature: {
                type: 'string',
                description: 'Chữ ký',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
        },
    },
    BankAccountQueryOutput: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'id người dùng',
                example: '639996cbd1b37c5632ac204c',
            },
            accountNumber: {
                type: 'string',
                description: 'Số tài khoản',
                example: '639996cbd1b37c5632ac204c',
            },
            type: {
                type: 'string',
                description: 'Loại tài khoản',
                example: 'Tài khoản thanh toán',
            },
            user:{
                type: 'object',
                $ref: '#components/schemas/User'
            },
        },
    },
    BankAccountAndBankType: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'id người dùng',
                example: '639996cbd1b37c5632ac204c',
            },
            accountNumber: {
                type: 'string',
                description: 'Số tài khoản',
                example: '639996cbd1b37c5632ac204c',
            },
            user:{
                type: 'object',
                $ref: '#components/schemas/User'
            },
        },
    },
    RechargeMoneyInput: {
        type: 'object',
        properties: {
            senderAccountNumber: {
                type: 'string',
                description: 'tài khoản người gửi',
                example: '639996cbd1b37c5632ac204c',
            },
            receiverAccountNumber: {
                type: 'string',
                description: 'tài khoản người nhận',
                example: '639996cbd1b37c5632ac204c',
            },
            deposit: {
                type: Int32,
                description: 'Số tiền gửi',
                example: 100,
            },
            hashValue: {
                type: 'string',
                description: 'Mã hash value',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
            signature: {
                type: 'string',
                description: 'Chữ ký',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
            description: {
                type: 'string',
                description: 'Nội dụng chuyển khoản',
                example: 'Chuyển tiền lương',
            },
            transferTime: {
                type: 'string',
                description: 'Thời gian giao dịch',
                example: '15/10/2022',
            },
        },
    },
    RechargeMoneyOutput: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Mã giao dịch',
                example: '639996cbd1b37c5632ac204sdsc',
            },
            senderAccountNumber: {
                type: 'string',
                description: 'tài khoản người gửi',
                example: '639996cbd1b37c5632ac204c',
            },
            receiverAccountNumber: {
                type: 'string',
                description: 'tài khoản người nhận',
                example: '639996cbd1b37c5632ac204c',
            },
            deposit: {
                type: Int32,
                description: 'Số tiền gửi',
                example: 100,
            },
            hashValue: {
                type: 'string',
                description: 'Mã hash value',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
            signature: {
                type: 'string',
                description: 'Chữ ký',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJBY2NvdW50TnVtYmVyIjoiMTIzNDU2IiwicmVjZWl2ZXJBY2NvdW50TnVtYmVyIjoiMjQzMjc1IiwiZGVwb3NpdCI6MjAwMCwidHJhbnNmZXJUaW1lIjoiMTY3MzA2NTA1NyIsImlhdCI6MTY3MzA2NjUzOX0.ASBgfzM3ZAVAUKx__GEKOdOJuaOjSRlMKtpH64jEjFszH7jmrQ0l3Sz_F5WGT-ESwfFxv_6OOSN-MIlJZuxMh8ePxbjqeEpB-ZwFSjITd3B6miMxbp7g_Ka4A8vmv8i6-W7KRAkcF41AlxaPfC7_8y4tDx0usQefg_k5tYe2NEk',
            },
            transferTime: {
                type: 'string',
                description: 'Thời gian giao dịch',
                example: '15/10/2022',
            },
        },
    },
};
