export default {
  "/debits": {
    get: {
      tags: ["Debit API"],
      description: "Lấy tất cả các nhắc nợ",
      operationId: "getAllDebit",
      parameters: [
        {
          name: "accountNumber",
          in: "query",
          schema: {
            type: "string",
          },
          required: true,
          description: "Số tài khoản ngân hàng",
          example: "186672",
        },
        {
          name: "side",
          in: "query",
          schema: {
            type: "string",
          },
          required: true,
          description: "Nhắc nợ của một phía (bản thân hoặc người khác)",
          example: "personal",
        },
      ],
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy danh sách nhắc nợ thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#components/schemas/Debit",
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Debit API"],
      description: "Thêm nhắc nợ mới",
      operationId: "createDebit",
      requestBody: {
        description: "Thông tin nhắc nợ mới",
        content: {
          "application/json": {
            schema: {
              $ref: "#components/schemas/DebitInput",
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
          description: "Tạo nhắc nợ thành công",
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
                    example: "Tạo nhắc nợ thành công",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/debits/{id}": {
    patch: {
      tags: ["Debit API"],
      description: "Cập nhập nhắc nợ",
      operationId: "updateDebit",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id của nhắc nợ",
          example: "63b3d2a5d6026c3974342876",
        },
      ],
      requestBody: {
        description: "Thông tin nhắc nợ được cập nhập",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isPaid: {
                  type: "boolean",
                  description: "Đã thanh toán hay chưa",
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
          description: "Cập nhập thành công",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "Cập nhập thành công!",
              },
            },
          },
        },
      },
    },
  },
  "/debits/{id}/{side}": {
    put: {
      tags: ["Debit API"],
      description: "Hủy nhắc nợ",
      operationId: "deleteDebit",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id của nhắc nợ",
          example: "63b3d2a5d6026c3974342876",
        },
        {
          name: "side",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Nhắc nợ của một phía (bản thân hoặc người khác)",
          example: "personal",
        },
      ],
      requestBody: {
        description: "Nội dung hủy nhắc nợ",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "Nội dung hủy nhắc nợ",
                  example: "Nợ tôi trả lâu rồi",
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
          description: "Hủy nợ thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Thông báo kết quả thực thi",
                    example: "Nhắc nợ đã bị hủy",
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
