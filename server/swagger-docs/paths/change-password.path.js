export default {
    "/change-password": {
      post: {
        tags: ["Change Password API"],
        description: "Lấy tất cả user theo role",
        operationId: "changePassword",
        requestBody: {
          description: "Thông tin tài khoản và mật khẩu",
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/ChangePassword",
              },
            },
          },
        },
        security: [
          {
            Authorization: [],
          },
        ],
        responses: {
          200: {
            description: "Thay đổi mật khẩu thành công"
          },
          400: {
            description: "Mật khẩu không đúng"
          },
          404: {
            description: "Không tìm thấy thông tin người dùng"
          },
          500: {
            description: "Lỗi hệ thống"
          },
        },
      },
    },

  };
  