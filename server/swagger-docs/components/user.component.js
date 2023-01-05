export default {
    User: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email",
          example: 'huutinhluu@gmail.com',
        },
        firstName: {
            type: "string",
            description: "Tên",
            example: 'Tình',
          },
          lastName: {
            type: "string",
            description: "Họ",
            example: 'Lưu',
          },
          phoneNumber: {
            type: "string",
            description: "Số điện thoại",
            example: '044934242',
          }
      },
    },
  };
  