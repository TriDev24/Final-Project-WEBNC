export default {
  "/notify/{accountNumber}": {
    get: {
      tags: ["Notify API"],
      description: "Lấy tất cả thông báo",
      operationId: "getAllNotify",
      parameters: [
        {
          name: "accountNumber",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Số tài khoản ngân hàng",
          example: "186672",
        },
      ],
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy tất cả thông báo thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#components/schemas/Notify",
                },
              },
            },
          },
        },
      },
    },
  },
  "/notify/{id}": {
    delete: {
      tags: ["Notify API"],
      description: "Xóa thông báo",
      operationId: "deleteNotify",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            type: "string",
          },
          required: true,
          description: "Id thông báo",
          example: "63b3d2a6d6026c3974342879",
        },
      ],
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Xóa thành công!",
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
