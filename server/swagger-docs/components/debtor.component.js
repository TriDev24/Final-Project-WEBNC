export default {
  Debtor: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        description: "Id của một model",
        example: "63b39a48053608b5add1461c",
      },
      accountId: {
        type: "string",
        description: "Id tài khoản ngân hàng của người tạo nhắc nợ",
        example: "6399b69c68d8f792ed3bde8f",
      },
      debtAccountId: {
        type: "object",
        properties: {
          accountNumber: {
            type: "string",
            description: "Số tài khoản",
            example: "243275",
          },
          identityId: {
            type: "object",
            properties: {
              aliasName: {
                type: "string",
                description: "Tên gợi nhớ",
                example: "Tiến Tài",
              },
            },
          },
        },
        description: "Thông tin của người nợ",
      },
    },
  },
};
