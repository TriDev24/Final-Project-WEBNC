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
                                    $ref: '#components/schemas/BankAccount',
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
                    description: 'Tạo tài khoản thành công',
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
        get: {
            tags: ['Bank Account API'],
            description: 'Lấy thông tin chi tiết tài khoản',
            operationId: 'getById',
            parameters: [
                {
                  name: "id",
                  in: "path",
                  schema: {
                    type: "string",
                  },
                  required: true,
                  description: "Id account",
                  example: "63b3d2a6d6026c3974342879",
                },
            ],
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin chi tiết tài khoản thành công',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#components/schemas/BankAccount',
                            },
                        },
                    },
                },
                400: {
                    description: "Bad request"
                  },
                  404: {
                    description: "Không tìm thấy thông tin tài khoản"
                  },
                  500: {
                    description: "Lỗi hệ thống"
                  },
            },
        },
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
                description: 'Thông tin tài khoản cập nhập',
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
                                isLockActionTrigger: {
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
    '/bank-accounts/all': {
        get: {
            tags: ['Bank Account API'],
            description: 'Lấy tất cả các tài khoản ngân hàng',
            operationId: 'getAll',
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
                                    $ref: '#components/schemas/BankAccount',
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Bad request"
                  },
                  404: {
                    description: "Không tìm thấy thông tin tài khoản"
                  },
                  500: {
                    description: "Lỗi hệ thống"
                  },
            },
        }
    },
    '/bank-accounts/query-account': {
        get: {
            tags: ['Bank Account API'],
            description: 'Lấy thông tin tài khoản thanh toán',
            operationId: 'queryAccount',
            requestBody: {
                description: 'Thông tin nhắc nợ mới',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#components/schemas/BankAccountQueryInput',
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
                    description: 'Lấy thông tin tài khoản thanh toán thành công',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#components/schemas/BankAccountQueryOutput',
                            },
                        },
                    },
                },
                400: {
                    description: "Bad request"
                  },
                  404: {
                    description: "Không tìm thấy thông tin tài khoản"
                  },
                  500: {
                    description: "Lỗi hệ thống"
                  },
            },
        }
    },
    '/bank-accounts/by-account-number-and-bank-type': {
        get: {
            tags: ['Bank Account API'],
            description: 'Lấy thông tin tài khoản và thông tin ngân hàng',
            operationId: 'getByAccountNumberAndBankType',
            parameters: [
                {
                    name: 'accountNumber',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Số tài khoản của tài khoản ngân hàng',
                    example: '63b3d2a5d6026c3974342876',
                },
                {
                    name: 'bankTypeId',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Mã loại ngân hàng',
                    example: '63b3d2a5d6026c3974342346',
                },
            ],
            security: [
                {
                    Authorization: [],
                },
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin tài khoản và ngân hàng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#components/schemas/BankAccountAndBankType',
                            },
                        },
                    },
                },
                400: {
                    description: "Bad request"
                  },
                  404: {
                    description: "Không tìm thấy thông tin tài khoản"
                  },
                  500: {
                    description: "Lỗi hệ thống"
                  },
            },
        }
    },
    '/bank-accounts/payment-transaction': {
        post: {
            tags: ['Bank Account API'],
            description: 'Chuyển tiền',
            operationId: 'rechargeMoney',
            requestBody: {
                description: 'Chuyển tiền',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#components/schemas/RechargeMoneyInput',
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
                    description: 'Giao dịch thành công',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#components/schemas/RechargeMoneyOutput',
                            },
                        },
                    },
                },
                400: {
                    description: "Bad request"
                  },
                  401: {
                    description: "Xin lỗi đã hết thời gian chuyển khoản."
                  },
                  404: {
                    description: "Không tìm thấy tài khoản ngân hàng này"
                  },
                  500: {
                    description: "Lỗi hệ thống"
                  },
            },
        }
    },
};
