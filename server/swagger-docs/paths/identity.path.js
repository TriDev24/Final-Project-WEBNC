export default {
  "/identities": {
    post: {
      tags: ["Identity API"],
      description: "Tạo tài khoản mới cho khách hàng",
      operationId: "create",
      requestBody: {
        description: "Thông tin tài khoản",
        content: {
          "application/json": {
            schema: {
              $ref: "#components/schemas/IdentityInput",
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
          description: "Tạo tài khoản thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/Identity",
              },
            },
          },
        },
      },
    },
  },
  "/identities/send-mail/{email}": {
    get: {
      tags: ["Identity API"],
      description: "Gửi mail có chứa mã OTP",
      operationId: "sendMail",
      parameters: [
        {
          name: "email",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Email của tài khoản khách hàng",
          example: "trantai@crossfitcoastal.com",
        },
      ],
      responses: {
        200: {
          description: "Gửi mail thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    description: "Trạng thái kết quả thực thi",
                    example: "success",
                  },
                  message: {
                    type: "string",
                    description: "Thông báo kết quả thực thi",
                    example:
                      "Chúng tôi đã gửi đến email của bạn mã OTP, mong bạn kiểm tra và xác nhận mã OTP",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/identities/verify": {
    post: {
      tags: ["Identity API"],
      description: "Xác thực mã OTP và đổi mật khẩu",
      operationId: "verifyAndChangePassword",
      requestBody: {
        description: "Mã OTP và mật khẩu mới",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                otp: {
                  type: "string",
                  description: "Mã OTP",
                  example: "5312",
                },
                password: {
                  type: "string",
                  description: "Mật khẩu mới",
                  example: "987654321",
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Đặt lại mật khẩu thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    description: "Trạng thái kết quả thực thi",
                    example: "success",
                  },
                  message: {
                    type: "string",
                    description: "Thông báo kết quả thực thi",
                    example: "Đặt lại mật khẩu thành công",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/identities/refresh-token": {
    post: {
      tags: ["Identity API"],
      description: "Tạo access token mới",
      operationId: "generateAccessToken",
      requestBody: {
        description: "Refresh token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                refreshToken: {
                  type: "string",
                  description: "Refresh token",
                  example:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjM5OWI2OWM2OGQ4Zjc5MmVkM2JkZThjIiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTY3MjcxNDQ4NCwiZXhwIjoxNjczMzE5Mjg0fQ.S9eXv25WRff6zPq55D3Ow_XHGnx-u7pyQ0l-D4ceYkU",
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
          description: "Access token mới",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    description: "Thông báo kết quả thực thi",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjM5OWI2OWM2OGQ4Zjc5MmVkM2JkZThjIiwicm9sZSI6ImN1c3RvbWVyIn0sImlhdCI6MTY3MjcxNDQ4NCwiZXhwIjoxNjczMzE5Mjg0fQ.S9eXv25WRff6zPq55D3Ow_XHGnx-u7pyQ0l-D4ceYkU",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/identities/login":{
    post: {
      tags: ["Identity API"],
      description: "Đăng nhập tài khoản",
      operationId: "login",
      requestBody: {
        description: "Thông tin đăng nhập",
        content: {
          "application/json": {
            schema: {
              type:"object",
              properties:{
                email:{
                  type:"string",
                  example:"trantai@chantellegribbon.com"
                }, password:{
                  type:"string",
                  example:"12345678"
                }, g_token:{
                  type:"string",
                  example:"09AJ4Tk-4NMFhY0RP54Tr_ujIGv_bWjxIJKx1vOr8GK5Uf-VvHlzC2gRKuPAi7-2aTFnMqmHUGl47XMLGzWPCNxphJ-orPY-TFOVk"
                }
              }
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Đăng nhập thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/IdentityOutputLogin",
              },
            },
          },
        },
      },
    },
  },
  "/identities/create-employee": {
    post: {
      tags: ["Identity API"],
      description: "Thêm nhân viên mới",
      operationId: "createEmployee",
      requestBody: {
        description: "Thông tin nhân viên",
        content: {
          "application/json": {
            schema: {
              $ref: "#components/schemas/IdentityInputCreateEmployee",
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
          description: "Thêm nhân viên thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/IdentityCreateEmployee",
              },
            },
          },
        },
      },
    },
  },
};
