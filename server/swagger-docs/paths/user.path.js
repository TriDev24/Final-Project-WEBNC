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
      delete: {
        tags: ["User API"],
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
  