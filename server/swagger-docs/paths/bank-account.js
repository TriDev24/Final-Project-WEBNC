export default {
    '/bank-accounts': {
        get: {
            tags: ['Bank Account API'],
            description: 'Lấy tất cả các tài khoản ngân hàng của 1 user',
            operationId: 'getAllBankAccount',
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách tài khoản ngân hàng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#components/schemas/Debit',
                                },
                            },
                        },
                    },
                },
            },
        },

        post: {
            tags: ['Bank Account API'],
            description: 'Thêm nhắc nợ mới',
            operationId: 'createBankAccount',
            requestBody: {
                description: 'Thông tin nhắc nợ mới',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#components/schemas/BankAccountInput',
                        },
                    },
                },
                required: true,
            },
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Tạo nhắc nợ thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        description:
                                            'Trạng thái kết quả thực thi',
                                        example: 'success',
                                    },
                                    message: {
                                        type: 'string',
                                        description:
                                            'Thông báo kết quả thực thi',
                                        example: 'Tạo nhắc nợ thành công',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/bank-accounts/{id}': {
        patch: {
            tags: ['Bank Account API'],
            description: 'Cập nhật tài khoản ngân hàng',
            operationId: 'updateBankAccount',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Id của tài khoản ngân hàng',
                    example: '63b3d2a5d6026c3974342876',
                },
            ],
            requestBody: {
                description: 'Thông tin nhắc nợ được cập nhập',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                isPayment: {
                                    type: 'boolean',
                                    description:
                                        'Chuyển thành tài khoản thanh toán',
                                    example: true,
                                },
                                isLocked: {
                                    type: 'boolean',
                                    description: 'Đã thanh toán hay chưa',
                                    example: true,
                                },
                                deposit: {
                                    type: 'integer',
                                    description: 'Đã thanh toán hay chưa',
                                    example: true,
                                },
                            },
                        },
                    },
                },
                required: true,
            },
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Cập nhập thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'string',
                                example: 'Cập nhập thành công!',
                            },
                        },
                    },
                },
            },
        },
    },
    '/debits/{id}/{side}': {
        put: {
            tags: ['Debit API'],
            description: 'Hủy nhắc nợ',
            operationId: 'deleteDebit',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Id của nhắc nợ',
                    example: '63b3d2a5d6026c3974342876',
                },
                {
                    name: 'side',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description:
                        'Nhắc nợ của một phía (bản thân hoặc người khác)',
                    example: 'personal',
                },
            ],
            requestBody: {
                description: 'Nội dung hủy nhắc nợ',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                content: {
                                    type: 'string',
                                    description: 'Nội dung hủy nhắc nợ',
                                    example: 'Nợ tôi trả lâu rồi',
                                },
                            },
                        },
                    },
                },
                required: true,
            },
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Hủy nợ thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description:
                                            'Thông báo kết quả thực thi',
                                        example: 'Nhắc nợ đã bị hủy',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
