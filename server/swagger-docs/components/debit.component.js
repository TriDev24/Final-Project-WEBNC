export default {
  Debit: {
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
      amountToPay: {
        type: "integer",
        description: "Số tiền phải trả",
        example: 50000,
      },
      content: {
        type: "string",
        description: "Nội dung nhắc nợ",
        example: "Trả tiền tết",
      },
      statusId: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Tên trạng thái",
            example: "unpaid",
          },
        },
        description: "Trạng thái nhắc nợ",
      },
      transferDate: {
        type: "string",
        description: "Ngày thanh toán",
        example: "1672658618550",
      },
      createdAt: {
        type: "string",
        description: "Ngày tạo",
        example: "1672658586182",
      },
      updatedAt: {
        type: "string",
        description: "Ngày cập nhập",
        example: "1672658618550",
      },
    },
  },
  DebitInput: {
    type: "object",
    properties: {
      accountNumber: {
        type: "string",
        description: "Số tài khoản của người tạo nhắc nợ",
        example: "186672",
      },
      debtAccountNumber: {
        type: "string",
        description: "Số tài khoản của người nợ",
        example: "243275",
      },
      amountToPay: {
        type: "integer",
        description: "Số tiền phải trả",
        example: 50000,
      },
      content: {
        type: "string",
        description: "Nội dung nhắc nợ",
        example: "Trả tiền tết",
      },
    },
  },
};
