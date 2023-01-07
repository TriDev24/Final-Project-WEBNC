export default {
  "/receivers": {
    get: {
      tags: ["Receiver API"],
      description: "Lấy danh sách người nhận",
      operationId: "getAll",
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy danh sách người nhận thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#components/schemas/Receiver",
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Receiver API"],
      description: "Tạo người nhận mới",
      operationId: "create",
      requestBody: {
        description: "Thông tin cần cập nhập",
        content: {
          "application/json": {
            schema: {
                $ref: '#components/schemas/ReceiverInput',
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
          description: "Thêm người nhận thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#components/schemas/Receiver",
                },
              },
            },
          },
        },
      },
    },
  },
  "/receivers/{id}": {
    get: {
      tags: ["Receiver API"],
      description: "Lấy thông tin người nhận",
      operationId: "getById",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id của người nhận",
          example: "63b91976506f26e016c2f3a3",
        },
      ],
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy thông tin người nhận thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#components/schemas/Receiver",
                },
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Receiver API"],
      description: "Xóa người nhận",
      operationId: "delete",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id của người nhận",
          example: "63b91976506f26e016c2f3a3",
        },
      ],
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy thông tin người nhận thành công",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "Xoá người nhận thành công",
              },
            },
          },
        },
      },
    },

    update: {
      tags: ["Receiver API"],
      description: "Cập nhập người nhận",
      operationId: "update",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id của người nhận",
          example: "63b91976506f26e016c2f3a3",
        },
      ],
      requestBody: {
        description: "Thông tin cần cập nhập",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                aliasName: {
                  type: "string",
                  example: "Trần Tài",
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
                example: "Cập nhật thành công",
              },
            },
          },
        },
      },
    },
  },
};
