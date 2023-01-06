export default {
    '/debtors': {
        get: {
            tags: ['Debtor API'],
            description: 'Lấy danh sách người nợ',
            operationId: 'getAllDebtor',
            parameters: [
                {
                    name: 'accountNumber',
                    in: 'query',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Số tài khoản ngân hàng',
                    example: '186672',
                },
            ],
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách người nợ thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#components/schemas/Debtor',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/debtors/{id}': {
        delete: {
            tags: ['Debtor API'],
            description: 'Xóa người nợ',
            operationId: 'deleteDebtor',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Id trong danh sách nợ',
                    example: '639d4cea0c741f577687420a',
                },
            ],
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                204: {
                    description: 'Xóa thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'string',
                                example: 'Xóa thành công!',
                            },
                        },
                    },
                },
            },
        },
    },
};
