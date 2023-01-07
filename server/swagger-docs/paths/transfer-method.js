export default {
  "/transfer-methods": {
    get: {
      tags: ["Transfer Method API"],
      description: "Lấy tất cả các hình thức thanh toán",
      operationId: "getAll",
      security: [
        {
          Authorization: [],
        },
      ],
      responses: {
        200: {
          description: "Lấy tất cả các hình thức thanh toán thành công",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      example: "63a15646e6ee6f225248396b",
                    },
                    name: {
                      type: "string",
                      example: "Sender Pay Transfer Fee",
                    },
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
