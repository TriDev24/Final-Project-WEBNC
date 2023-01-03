export default {
  Notify: {
    type: "object",
    properties: {
      count: {
        type: "integer",
        description: "Số lượng thông báo",
        example: 5,
      },
      notifies: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "63b3d73b2bd26bfe7250b5f4",
            },
            senderId: {
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
              description: "Thông tin của người gửi",
            },
            receiverId: {
              type: "string",
              description: "Id người nhận",
              example: "6399b69c68d8f792ed3bde8f",
            },
            statusId:{
                type:"object",
                properties:{
                    name:{
                        type:"string",
                        example:"paid"
                    }
                },
                description:"Trạng thái nhắc nợ"
            },
            side: {
              type: "string",
              example:"other",
              description: "Phía nhắc nợ (Bản thân hoặc người khác)",
            },
          },
        },
      },
    },
  },
};
