export default {
    '/billings/history': {
        get: {
            tags: ['Billing API'],
            description:
                'Lấy tất cả những hoá đơn được sort theo ngày và phân loại',
            operationId: 'getHistory',
            parameters: [
                {
                    name: 'email',
                    in: 'path',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Email của tài khoản khách hàng',
                    example: 'trantai@crossfitcoastal.com',
                },
            ],
            responses: {
                200: {
                    description: 'Gửi mail thành công',
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
                                        example:
                                            'Chúng tôi đã gửi đến email của bạn mã OTP, mong bạn kiểm tra và xác nhận mã OTP',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/identities/verify': {
        post: {
            tags: ['Identity API'],
            description: 'Xác thực mã OTP và đổi mật khẩu',
            operationId: 'verifyAndChangePassword',
            requestBody: {
                description: 'Mã OTP và mật khẩu mới',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                otp: {
                                    type: 'string',
                                    description: 'Mã OTP',
                                    example: '5312',
                                },
                                password: {
                                    type: 'string',
                                    description: 'Mật khẩu mới',
                                    example: '987654321',
                                },
                            },
                        },
                    },
                },
                required: true,
            },
            responses: {
                200: {
                    description: 'Đặt lại mật khẩu thành công',
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
                                        example: 'Đặt lại mật khẩu thành công',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/identities/refresh-token': {
        post: {
            tags: ['Identity API'],
            description: 'Tạo access token mới',
            operationId: 'generateAccessToken',
            requestBody: {
                description: 'Refresh token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                refreshToken: {
                                    type: 'string',
                                    description: 'Refresh token',
                                    example:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjM5OWI2OWM2OGQ4Zjc5MmVkM2JkZThjIiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTY3MjcxNDQ4NCwiZXhwIjoxNjczMzE5Mjg0fQ.S9eXv25WRff6zPq55D3Ow_XHGnx-u7pyQ0l-D4ceYkU',
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
                    description: 'Access token mới',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    accessToken: {
                                        type: 'string',
                                        description:
                                            'Thông báo kết quả thực thi',
                                        example:
                                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjM5OWI2OWM2OGQ4Zjc5MmVkM2JkZThjIiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTY3MjcxNDQ4NCwiZXhwIjoxNjczMzE5Mjg0fQ.S9eXv25WRff6zPq55D3Ow_XHGnx-u7pyQ0l-D4ceYkU',
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
