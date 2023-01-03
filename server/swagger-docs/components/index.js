import Identity from "./identity.component.js";
import Debit from "./debit.component.js";
import Debtor from "./debtor.component.js"
import Notify from "./notify.component.js"

export default {
  schemas: {
    _id: {
      type: "string",
      description: "id của một model",
      example: "6399b69c68d8f792ed3bde8c",
    },
    ...Identity,
    ...Debit,
    ...Debtor,
    ...Notify
  },
  securitySchemes: {
    Authorization: {
      type: "apiKey",
      name: "authorization",
      in: "header",
      description: "Access token",
    },
  },
};
