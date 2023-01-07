export default {
    "/bank-types": {
      get: {
        tags: ["Bank Type API"],
        description: "Lấy danh sách ngân hàng",
        operationId: "getAll",
        security: [
          {
            Authorization: [],
          },
        ],
        responses: {
          200: {
            description: "Lấy danh sách ngân hàng thành công",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "639e0560b35655896b2aa759",
                      },
                      name: {
                        type: "string",
                        example: "My Bank",
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
  