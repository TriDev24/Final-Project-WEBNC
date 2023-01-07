export default {
  Identity: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email của tài khoản",
        example: "trantai@crossfitcoastal.com",
      },
      password: {
        type: "string",
        description: "Mật khẩu của tài khoản",
        example: "987654321",
      },
      firstName: {
        type: "string",
        description: "Tên",
        example: "Tài",
      },
      lastName: {
        type: "string",
        description: "Tên",
        example: "Trần",
      },
      phoneNumber: {
        type: "string",
        description: "Số điện thoại",
        example: "0793677776",
      },
      aliasName: {
        type: "string",
        description: "Tên gợi nhớ",
        example: "Trần Tài",
      },
    },
  },

  IdentityInput: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email của tài khoản",
        example: "trantai@crossfitcoastal.com",
      },
      password: {
        type: "string",
        description: "Mật khẩu của tài khoản",
        example: "987654321",
      },
      firstName: {
        type: "string",
        description: "Tên",
        example: "Tài",
      },
      lastName: {
        type: "string",
        description: "Tên",
        example: "Trần",
      },
      phoneNumber: {
        type: "string",
        description: "Số điện thoại",
        example: "0793677776",
      },
      aliasName: {
        type: "string",
        description: "Tên gợi nhớ",
        example: "Trần Tài",
      },
    },
  },
  IdentityOutputLogin:{
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email của tài khoản",
        example: "trantai@chantellegribbon.com",
      },
      firstName: {
        type: "string",
        description: "Tên",
        example: "Tài",
      },
      lastName: {
        type: "string",
        description: "Tên",
        example: "Trần",
      },
      phoneNumber: {
        type: "string",
        description: "Số điện thoại",
        example: "0793677776",
      },
      aliasName: {
        type: "string",
        description: "Tên gợi nhớ",
        example: "Trần Tài",
      },
      role:{
        type:"string",
        description: "Role của tài khoản",
        example: "customer",
      }
    },
  },
  
  IdentityCreateEmployee: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email của nhân viên",
        example: "employee@gmail.com",
      },
      password: {
        type: "string",
        description: "Mật khẩu của nhân viên",
        example: "12345678",
      },
      firstName: {
        type: "string",
        description: "Tên",
        example: "Tài",
      },
      lastName: {
        type: "string",
        description: "Tên",
        example: "Trần",
      },
      phoneNumber: {
        type: "string",
        description: "Số điện thoại",
        example: "079158632111",
      },
      aliasName: {
        type: "string",
        description: "Tên gợi nhớ",
        example: "Trần Tài",
      },
    },
  },

  IdentityInputCreateEmployee: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Email của nhân viên",
        example: "employee@gmail.com",
      },
      password: {
        type: "string",
        description: "Mật khẩu của nhân viên",
        example: "12345678",
      },
      firstName: {
        type: "string",
        description: "Tên",
        example: "Tài",
      },
      lastName: {
        type: "string",
        description: "Tên",
        example: "Trần",
      },
      phoneNumber: {
        type: "string",
        description: "Số điện thoại",
        example: "079158632111",
      },
      aliasName: {
        type: "string",
        description: "Tên gợi nhớ",
        example: "Trần Tài",
      },
    },
  },
};
