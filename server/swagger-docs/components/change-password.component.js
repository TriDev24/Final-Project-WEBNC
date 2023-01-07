export default {
    ChangePassword: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Identify id of user",
          example: '63b8ff67f53a15dc2e45317b',
        },
        oldPassword: {
            type: "string",
            description: "Mật khẩu cũ",
            example: 'abcde12345Aa@',
          },
          newPassword: {
            type: "string",
            description: "Mật khẩu mới",
            example: 'lhtinh@a@x',
          }
      },
    },
  };
  