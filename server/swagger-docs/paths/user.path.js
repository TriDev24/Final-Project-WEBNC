export default {
    "/users": {
      get: {
        tags: ["User API"],
        description: "Lấy tất cả user theo role",
        operationId: "getAllUser",
        parameters: [
          {
            name: "role",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
            description: "Role of user",
            example: "employee",
          },
        ],
        security: [
          {
            Authorization: [],
          },
        ],
        responses: {
          200: {
            description: "Lấy tất cả user thành công",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#components/schemas/User",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/user/{id}": {
      get: {
        tags: ["User API"],
        description: "Lấy thông tin chi tiết user",
        operationId: "getUserDetail",
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "string",
            },
            required: true,
            description: "Id user",
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
            description: "Lấy thông tin chi tiết user thành công",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  $ref: "#components/schemas/User"
                },
              },
            },
          },
        },
      },
    },
  };
  